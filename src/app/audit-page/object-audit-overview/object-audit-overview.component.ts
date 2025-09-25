import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  forkJoin,
  Observable,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  switchMap, tap,
} from 'rxjs/operators';

import { COLLECTION_PAGE_LINKS_TO_FOLLOW } from '../../collection-page/collection-page.resolver';
import {
  AUDIT_PERSON_NOT_AVAILABLE,
  AuditDataService,
} from '../../core/audit/audit-data.service';
import { Audit } from '../../core/audit/model/audit.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import {getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload} from '../../core/shared/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { AuditTableComponent } from '../audit-table/audit-table.component';
import {DSONameService} from '../../core/breadcrumbs/dso-name.service';
import {DSpaceObjectDataService} from '../../core/data/dspace-object-data.service';
/**
 * Component displaying a list of all audit about a object in a paginated table
 */
@Component({
  selector: 'ds-object-audit-overview',
  templateUrl: './object-audit-overview.component.html',
  imports: [
    AsyncPipe,
    AuditTableComponent,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
export class ObjectAuditOverviewComponent implements OnInit, OnDestroy {

  /**
   * The object extracted from the route.
   */
  object: Item;

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

  objectId: string;

  objectName: string;

  dataNotAvailable = AUDIT_PERSON_NOT_AVAILABLE;

  sub: Subscription;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected itemService: ItemDataService,
              protected paginationService: PaginationService,
              protected collectionDataService: CollectionDataService,
              protected dsoNameService: DSONameService,
              protected dSpaceObjectDataService: DSpaceObjectDataService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('objectId')),
      switchMap((id: string) => this.dSpaceObjectDataService.findById(id, true, true)),
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((dso) => {
      this.objectId = dso.id;
      this.objectName = this.dsoNameService.getName(dso);
      this.setAudits();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    const config$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config);

    this.auditsRD$ = config$.pipe(
      switchMap((config) =>
        this.auditService.findByObject(this.objectId, config).pipe(
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
}
