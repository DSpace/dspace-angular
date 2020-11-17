import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest as observableCombineLatest, Subscription, Observable, of as observableOf } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { ObservedValueOf } from 'rxjs/internal/types';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { GroupDtoModel } from '../../../core/eperson/models/group-dto.model';
import { Group } from '../../../core/eperson/models/group.model';
import { RouteService } from '../../../core/services/route.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { PageInfo } from '../../../core/shared/page-info.model';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-groups-registry',
  templateUrl: './groups-registry.component.html',
})
/**
 * A component used for managing all existing groups within the repository.
 * The admin can create, edit or delete groups here.
 */
export class GroupsRegistryComponent implements OnInit, OnDestroy {

  messagePrefix = 'admin.access-control.groups.';

  /**
   * Pagination config used to display the list of groups
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'groups-list-pagination',
    pageSize: 5,
    currentPage: 1
  });

  /**
   * A list of all the current Groups within the repository or the result of the search
   */
  groups$: BehaviorSubject<RemoteData<PaginatedList<Group>>> = new BehaviorSubject<RemoteData<PaginatedList<Group>>>({} as any);
  /**
   * A BehaviorSubject with the list of GroupDtoModel objects made from the Groups in the repository or
   * as the result of the search
   */
  groupsDto$: BehaviorSubject<PaginatedList<GroupDtoModel>> = new BehaviorSubject<PaginatedList<GroupDtoModel>>({} as any);

  /**
   * An observable for the pageInfo, needed to pass to the pagination component
   */
  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);

  // The search form
  searchForm;

  // Current search in groups registry
  currentSearchQuery: string;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(public groupService: GroupDataService,
              private ePersonDataService: EPersonDataService,
              private dSpaceObjectDataService: DSpaceObjectDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private formBuilder: FormBuilder,
              protected routeService: RouteService,
              private router: Router,
              private authorizationService: AuthorizationDataService,
              public requestService: RequestService) {
    this.currentSearchQuery = '';
    this.searchForm = this.formBuilder.group(({
      query: this.currentSearchQuery,
    }));
  }

  ngOnInit() {
    this.search({ query: this.currentSearchQuery });
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.config.currentPage = event;
    this.search({ query: this.currentSearchQuery })
  }

  /**
   * Search in the groups (searches by group name and by uuid exact match)
   * @param data  Contains query param
   */
  search(data: any) {
    const query: string = data.query;
    if (query != null && this.currentSearchQuery !== query) {
      this.router.navigateByUrl(this.groupService.getGroupRegistryRouterLink());
      this.currentSearchQuery = query;
      this.config.currentPage = 1;
    }
    this.subs.push(this.groupService.searchGroups(this.currentSearchQuery.trim(), {
      currentPage: this.config.currentPage,
      elementsPerPage: this.config.pageSize
    }).subscribe((groupsRD: RemoteData<PaginatedList<Group>>) => {
        this.groups$.next(groupsRD);
        this.pageInfoState$.next(groupsRD.payload.pageInfo);
      }
    ));

    this.subs.push(this.groups$.pipe(
      getAllSucceededRemoteDataPayload(),
      switchMap((groups: PaginatedList<Group>) => {
        return observableCombineLatest(...groups.page.map((group: Group) => {
          return observableCombineLatest(
            this.authorizationService.isAuthorized(FeatureID.CanDelete, hasValue(group) ? group.self : undefined),
            this.hasLinkedDSO(group),
            (isAuthorized: ObservedValueOf<Observable<boolean>>, hasLinkedDSO: ObservedValueOf<Observable<boolean>>) => {
              const groupDtoModel: GroupDtoModel = new GroupDtoModel();
              groupDtoModel.ableToDelete = isAuthorized && !hasLinkedDSO;
              groupDtoModel.group = group;
              return groupDtoModel;
            }
          )
        })).pipe(map((dtos: GroupDtoModel[]) => {
          return new PaginatedList(groups.pageInfo, dtos);
        }))
      })).subscribe((value: PaginatedList<GroupDtoModel>) => {
      this.groupsDto$.next(value);
      this.pageInfoState$.next(value.pageInfo);
    }));
  }

  /**
   * Delete Group
   */
  deleteGroup(group: Group) {
    if (hasValue(group.id)) {
      this.groupService.deleteGroup(group).pipe(take(1))
        .subscribe(([success, optionalErrorMessage]: [boolean, string]) => {
          if (success) {
            this.notificationsService.success(this.translateService.get(this.messagePrefix + 'notification.deleted.success', { name: group.name }));
            this.reset();
          } else {
            this.notificationsService.error(
              this.translateService.get(this.messagePrefix + 'notification.deleted.failure.title', { name: group.name }),
              this.translateService.get(this.messagePrefix + 'notification.deleted.failure.content', { cause: optionalErrorMessage }));
          }
        })
    }
  }

  /**
   * This method will ensure that the page gets reset and that the cache is cleared
   */
  reset() {
    this.groupService.getBrowseEndpoint().pipe(
      switchMap((href) => this.requestService.removeByHrefSubstring(href)),
      filter((isCached) => isCached),
      take(1)
    ).subscribe(() => {
      this.cleanupSubscribes();
      this.search({ query: this.currentSearchQuery });
    });
  }

  /**
   * Get the members (epersons embedded value of a group)
   * @param group
   */
  getMembers(group: Group): Observable<RemoteData<PaginatedList<EPerson>>> {
    return this.ePersonDataService.findAllByHref(group._links.epersons.href);
  }

  /**
   * Get the subgroups (groups embedded value of a group)
   * @param group
   */
  getSubgroups(group: Group): Observable<RemoteData<PaginatedList<Group>>> {
    return this.groupService.findAllByHref(group._links.subgroups.href);
  }

  /**
   * Check if group has a linked object (community or collection linked to a workflow group)
   * @param group
   */
  hasLinkedDSO(group: Group): Observable<boolean> {
    return this.dSpaceObjectDataService.findByHref(group._links.object.href).pipe(
      map((rd: RemoteData<DSpaceObject>) => {
        if (hasValue(rd) && hasValue(rd.payload)) {
          return true;
        } else {
          return false
        }
      }),
      catchError(() => observableOf(false)),
    );
  }

  /**
   * Reset all input-fields to be empty and search all search
   */
  clearFormAndResetResult() {
    this.searchForm.patchValue({
      query: '',
    });
    this.search({ query: '' });
  }

  /**
   * Extract optional UUID from a group name => To be resolved to community or collection with link
   * (Or will be resolved in backend and added to group object, tbd) //TODO
   * @param groupName
   */
  getOptionalComColFromName(groupName: string): string {
    return this.groupService.getUUIDFromString(groupName);
  }

  /**
   * Unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.cleanupSubscribes();
  }

  cleanupSubscribes() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
