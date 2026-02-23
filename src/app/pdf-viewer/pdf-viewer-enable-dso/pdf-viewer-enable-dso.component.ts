import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { UpdateDataService } from '@dspace/core/data/update-data.service';
import {
  APP_DATA_SERVICES_MAP,
  LazyDataServicesMap,
} from '@dspace/core/data-services-map-type';
import { lazyDataService } from '@dspace/core/lazy-data-service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  first,
  map,
  switchMap,
} from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { getDSORoute } from '../../core/router/utils/dso-route.utils';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { ResourceType } from '../../core/shared/resource-type';
import { PdfViewerEnableComponent } from '../pdf-viewer-enable/pdf-viewer-enable.component';

@Component({
  selector: 'ds-pdf-viewer-enable-dso',
  templateUrl: './pdf-viewer-enable-dso.component.html',
  styleUrls: ['./pdf-viewer-enable-dso.component.scss'],
  imports: [
    CommonModule,
    PdfViewerEnableComponent,
    TranslateModule,
  ],
})
export class PdfViewerEnableDsoComponent implements OnInit, OnDestroy {

  dsoRD$: Observable<RemoteData<DSpaceObject>>;

  initialDSO: DSpaceObject;

  enableViewer: boolean;

  protected dsoDataService: UpdateDataService<DSpaceObject>;

  buttonStyle$: Observable<string>;

  subs: Subscription[] = [];


  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected parentInjector: Injector,
    @Inject(APP_DATA_SERVICES_MAP) private dataServiceMap: LazyDataServicesMap,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(first(),
      map((data) => data.dso));
    this.subs.push(
      this.dsoRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((dso: DSpaceObject) => {
          this.initialDSO = dso;

          let resourceType = this.initialDSO.type;
          if (isNotEmpty(resourceType) && hasNoValue(resourceType.value)) {
            resourceType = new ResourceType(resourceType as any as string);
          }

          const lazyProvider$: Observable<UpdateDataService<DSpaceObject>> = lazyDataService(this.dataServiceMap, resourceType.value, this.parentInjector);
          return lazyProvider$;
        }),
      ).subscribe((lazyDsoDataService: UpdateDataService<DSpaceObject>) => {
        this.dsoDataService = lazyDsoDataService;
      }),
    );
    this.buttonStyle$ = this.route.data.pipe(first(),
      map((data) => data.buttonStyle));
  }

  onSubmit(): void {
    if (hasNoValue(this.dsoDataService) || hasNoValue(this.initialDSO)) {
      return;
    }

    const operations: Operation[] = [];
    operations.push({
      op: hasValue(this.initialDSO.firstMetadataValue('dspace.pdfviewer.enabled')) ? 'replace' : 'add',
      path: `/metadata/dspace.pdfviewer.enabled`,
      value: {
        value: this.enableViewer,
        language: null,
      },
    });

    this.handleResponse(this.dsoDataService.patch(this.initialDSO, operations));
  }

  handleResponse(response: Observable<RemoteData<DSpaceObject>>): void {
    this.subs.push(response.pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translate.get(`pdf-viewer.enable.${this.initialDSO.type}.submit.success`));
      } else {
        this.notificationsService.error(this.translate.get(`pdf-viewer.enable.${this.initialDSO.type}.submit.error`));
      }
    }));
  }

  back(): void {
    this.router.navigate([getDSORoute(this.initialDSO)]);
  }

  setEnabled(event: string): void {
    this.enableViewer = event === 'true';
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
