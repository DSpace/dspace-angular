import {
  AsyncPipe,
  DatePipe,
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
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  forkJoin,
  Observable,
  of,
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';

import { COLLECTION_PAGE_LINKS_TO_FOLLOW } from '../../collection-page/collection-page.resolver';
import {
  AUDIT_PERSON_NOT_AVAILABLE,
  AuditDataService,
} from '../../core/audit/audit-data.service';
import { Audit } from '../../core/audit/model/audit.model';
import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component displaying a list of all audit about a object in a paginated table
 */
@Component({
  selector: 'ds-object-audit-overview',
  templateUrl: './object-audit-overview.component.html',
  imports: [
    PaginationComponent,
    AsyncPipe,
    TranslateModule,
    VarDirective,
    RouterLink,
    DatePipe,
  ],
  standalone: true,
})
export class ObjectAuditOverviewComponent implements OnInit {

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

  constructor(protected authService: AuthService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected itemService: ItemDataService,
              protected authorizationService: AuthorizationDataService,
              protected paginationService: PaginationService,
              protected collectionDataService: CollectionDataService,
              public dsoNameService: DSONameService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((paramMap: ParamMap) => this.itemService.findById(paramMap.get('objectId'))),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
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

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    const config$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config);
    const isAdmin$ = this.isCurrentUserAdmin();
    const parentCommunity$ = this.owningCollection$.pipe(
      switchMap(collection => collection.parentCommunity),
      getFirstCompletedRemoteData(),
      map(data => data?.payload),
    );

    this.auditsRD$ = combineLatest([isAdmin$, config$, this.owningCollection$, parentCommunity$]).pipe(
      mergeMap(([isAdmin, config,  owningCollection, parentCommunity]) => {
        if (isAdmin) {
          return this.auditService.findByObject(this.object.id, config, owningCollection.id, parentCommunity.id).pipe(
            getFirstCompletedRemoteData(),
          );
        }
        return of(null);
      }),
      filter(data => data && data?.payload?.page?.length > 0),
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

  isCurrentUserAdmin(): Observable<boolean> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([isCollectionAdmin, isCommunityAdmin, isSiteAdmin]) => {
        return isCollectionAdmin || isCommunityAdmin || isSiteAdmin;
      }),
      take(1),
    );
  }
}
