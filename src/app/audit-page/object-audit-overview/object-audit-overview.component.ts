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
  switchMap,
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
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { AuditTableComponent } from '../audit-table/audit-table.component';
/**
 * Component displaying a list of all audit about a object in a paginated table
 */
@Component({
  selector: 'ds-object-audit-overview',
  templateUrl: './object-audit-overview.component.html',
  imports: [
    AsyncPipe,
    TranslateModule,
    AuditTableComponent,
    RouterLink,
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

  owningCollection$: Observable<Collection>;

  dataNotAvailable = AUDIT_PERSON_NOT_AVAILABLE;

  sub: Subscription;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected itemService: ItemDataService,
              protected paginationService: PaginationService,
              protected collectionDataService: CollectionDataService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => this.itemService.findById(paramMap.get('objectId'))),
      getFirstCompletedRemoteData(),
    ).subscribe((rd) => {
      this.object = rd.payload;
      this.owningCollection$ = this.collectionDataService.findOwningCollectionFor(
        this.object,
        true,
        false,
        ...COLLECTION_PAGE_LINKS_TO_FOLLOW,
      ).pipe(
        getFirstCompletedRemoteData(),
        map(data => data?.payload),
      );
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
    const parentCommunity$ = this.owningCollection$.pipe(
      switchMap(collection => collection.parentCommunity),
      getFirstCompletedRemoteData(),
      map(data => data?.payload),
    );

    this.auditsRD$ = combineLatest([ config$, this.owningCollection$, parentCommunity$]).pipe(
      switchMap(([config,  owningCollection, parentCommunity]) =>
        this.auditService.findByObject(this.object.id, config, owningCollection.id, parentCommunity.id).pipe(
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
            otherAuditObject: this.auditService.getOtherObject(audit, this.object.id),
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
