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
} from 'rxjs/operators';

import { getDSORoute } from '../../core/router/utils/dso-route.utils';
import { DATA_SERVICE_FACTORY } from '../../core/cache/builders/build-decorators';
import { PatchData } from '../../core/data/base/patch-data';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { ResourceType } from '../../core/shared/resource-type';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { PdfViewerEnableComponent } from '../pdf-viewer-enable/pdf-viewer-enable.component';

@Component({
  selector: 'ds-pdf-viewer-enable-dso',
  templateUrl: './pdf-viewer-enable-dso.component.html',
  styleUrls: ['./pdf-viewer-enable-dso.component.scss'],
  standalone: true,
  imports: [
    PdfViewerEnableComponent,
    CommonModule,
    TranslateModule,
  ],
})
export class PdfViewerEnableDsoComponent implements OnInit, OnDestroy {

  dsoRD$: Observable<RemoteData<DSpaceObject>>;

  initialDSO: DSpaceObject;

  enableViewer: boolean;

  protected dataservice: PatchData<DSpaceObject>;

  buttonStyle$: Observable<string>;

  subs: Subscription[] = [];


  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected parentInjector: Injector,
    @Inject(DATA_SERVICE_FACTORY) private getDataServiceFor: (resourceType: ResourceType) => GenericConstructor<any>,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(first(),
      map((data) => data.dso));
    this.subs.push(
      this.dsoRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
      ).subscribe(async (dso) => {
        this.initialDSO = dso;

        let resourceType = this.initialDSO.type;

        if (isNotEmpty(resourceType) && hasNoValue(resourceType.value)) {
          resourceType = new ResourceType(resourceType as any as string);
        }

        const provider = this.getDataServiceFor(resourceType);
        const DataServiceClass = hasValue(provider) && typeof (provider as any).then === 'function'
          ? await (provider as unknown as Promise<any>)
          : provider;
        if (hasValue(DataServiceClass)) {
          this.dataservice = Injector.create({
            providers: [],
            parent: this.parentInjector,
          }).get(DataServiceClass);
        }
      }));
    this.buttonStyle$ = this.route.data.pipe(first(),
      map((data) => data.buttonStyle));
  }

  onSubmit(): void {
    if (hasNoValue(this.dataservice) || hasNoValue(this.initialDSO)) {
      return;
    }
    const operations: Operation[] = [];

    operations.push({
      op: 'replace',
      path: `/metadata/dspace.pdfviewer.enabled`,
      value: {
        value: this.enableViewer,
        language: null,
      },
    });

    this.handleResponse(this.dataservice.patch(this.initialDSO, operations));
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
