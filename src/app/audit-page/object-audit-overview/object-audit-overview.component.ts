import { Component, OnInit } from '@angular/core';

import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { Audit } from '../../core/audit/model/audit.model';
import { AuditDataService } from '../../core/audit/audit-data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { ItemDataService } from '../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { AuthService } from '../../core/auth/auth.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { Item } from '../../core/shared/item.model';
import { COLLECTION_PAGE_LINKS_TO_FOLLOW } from '../../collection-page/collection-page.resolver';

/**
 * Component displaying a list of all audit about a object in a paginated table
 */
@Component({
  selector: 'ds-object-audit-overview',
  templateUrl: './object-audit-overview.component.html',
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
      direction: SortDirection.DESC
    }
  });

  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'oop',
    pageSize: 10
  });

  /**
   * Date format to use for start and end time of audits
   */
  dateFormat = 'yyyy-MM-dd HH:mm:ss';

  owningCollection$: Observable<Collection>;

  constructor(protected authService: AuthService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected auditService: AuditDataService,
              protected itemService: ItemDataService,
              protected authorizationService: AuthorizationDataService,
              protected paginationService: PaginationService,
              protected collectionDataService: CollectionDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((paramMap: ParamMap) => this.itemService.findById(paramMap.get('objectId'))),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService)
    ).subscribe((rd) => {
      this.object = rd.payload;
      this.owningCollection$ = this.collectionDataService.findOwningCollectionFor(
        this.object,
        true,
        false,
        ...COLLECTION_PAGE_LINKS_TO_FOLLOW
      ).pipe(
        getFirstCompletedRemoteData(),
        map(data => data?.payload)
      );
      this.setAudits();
    });
  }

  /**
   * Send a request to fetch all audits for the current page
   */
  setAudits() {
    const config$ = this.paginationService.getFindListOptions(this.pageConfig.id, this.config, this.pageConfig);
    const isAdmin$ = this.isCurrentUserAdmin();
    const parentCommunity$ = this.owningCollection$.pipe(
      switchMap(collection => collection.parentCommunity),
      getFirstCompletedRemoteData(),
      map(data => data?.payload)
    );


    this.auditsRD$ = combineLatest([isAdmin$, config$, this.owningCollection$, parentCommunity$]).pipe(
      mergeMap(([isAdmin, config,  owningCollection, parentCommunity]) => {
        if (isAdmin) {
          return this.auditService.findByObject(this.object.id, config, owningCollection.id, parentCommunity.id);
        }

        return of(null);
      })
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

  /**
   * Get the name of an EPerson by ID
   * @param audit  Audit object
   */
  getEpersonName(audit: Audit): Observable<string> {
    return this.auditService.getEpersonName(audit);
  }

  getOtherObject(audit: Audit, contextObjectId: string): Observable<any> {
    return this.auditService.getOtherObject(audit, contextObjectId);
  }

}
