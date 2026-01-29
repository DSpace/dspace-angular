import {
  AsyncPipe,
  Location,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterLink,
} from '@angular/router';
import { AuditDataService } from '@dspace/core/data/audit-data.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { getDSORoute } from '@dspace/core/router/utils/dso-route.utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  forkJoin,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';

import { Audit } from '../../core/audit/model/audit.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { AuditTableComponent } from '../audit-table/audit-table.component';
/**
 * Component displaying a list of all audit about a object in a paginated table
 */
@Component({
  selector: 'ds-object-audit-logs',
  templateUrl: './object-audit-logs.component.html',
  imports: [
    AsyncPipe,
    AuditTableComponent,
    RouterLink,
    TranslateModule,
  ],
})
export class ObjectAuditLogsComponent implements OnInit {

  /**
   * The object extracted from the route.
   */
  object: DSpaceObject;

  /**
   * List of all audits
   */
  auditsRD$: Observable<RemoteData<PaginatedList<Audit>>>;

  /**
   * The current pagination configuration for the page used by the FindAll method
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 10,
    sort: {
      field: 'timeStamp',
      direction: SortDirection.DESC,
    },
  });

  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'oop',
    pageSize: 10,
  });

  /**
   * Date format to use for start and end time of audits
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  objectId$: Observable<string>;

  objectId: string;

  objectName: string;

  objectRoute: string;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected paginationService: PaginationService,
              protected collectionDataService: CollectionDataService,
              protected dsoNameService: DSONameService,
              protected dSpaceObjectDataService: DSpaceObjectDataService,
              protected location: Location,
  ) {}

  ngOnInit(): void {
    this.objectId$ = this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.dSpaceObjectDataService.findById(id, true, true)),
      getFirstSucceededRemoteDataPayload(),
      tap((object) => {
        this.objectRoute = getDSORoute(object);
        this.objectId = object.id;
        this.objectName = this.dsoNameService.getName(object);
        this.setAudits();
      }),
      map(dso => dso.id),
    );
  }

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    const config$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config);

    this.auditsRD$ = config$.pipe(
      switchMap((config) =>
        this.auditService.findByObject(this.objectId, config, false).pipe(
          getFirstCompletedRemoteData(),
        ),
      ),
      filter(data => data && data?.payload?.page?.length > 0),
      map((audits) => {
        audits.payload?.page.forEach((audit) => {
          audit.hasDetails = this.auditService.auditHasDetails(audit);
        });

        return audits;
      }),
      mergeMap(auditsRD => {
        const updatedAudits$ = auditsRD.payload.page.map(audit => {
          return forkJoin({
            epersonName: this.auditService.getEpersonName(audit),
            otherAuditObject: this.auditService.getOtherObject(audit, this.objectId),
          }).pipe(
            map(({ epersonName, otherAuditObject }) =>
              Object.assign(new Audit(), audit, { epersonName, otherAuditObject }),
            ),
          );
        });
        return forkJoin(updatedAudits$).pipe(
          map(updatedAudits => Object.assign(new RemoteData(
            auditsRD.timeCompleted,
            auditsRD.msToLive,
            auditsRD.lastUpdated,
            auditsRD.state,
            auditsRD.errorMessage,
            Object.assign(new PaginatedList(), { ...auditsRD.payload, page: updatedAudits }),
            auditsRD.statusCode,
          ))),
        );
      }),
    );
  }

  goBack(): void {
    this.location.back();
  }
}
