import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { RestResponse } from '../../../../../core/cache/response.models';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { RemoteData } from '../../../../../core/data/remote-data';
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { Group } from '../../../../../core/eperson/models/group.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { hasValue } from '../../../../../shared/empty.util';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../../../shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-subgroups-list',
  templateUrl: './subgroups-list.component.html'
})
/**
 * The list of subgroups in the edit group page
 */
export class SubgroupsListComponent implements OnInit, OnDestroy {

  @Input()
  messagePrefix: string;

  /**
   * Result of search groups, initially all groups
   */
  groupsSearch: Observable<RemoteData<PaginatedList<Group>>>;
  /**
   * List of all subgroups of group being edited
   */
  subgroupsOfGroup: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Pagination config used to display the list of groups that are result of groups search
   */
  configSearch: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'search-subgroups-list-pagination',
    pageSize: 5,
    currentPage: 1
  });
  /**
   * Pagination config used to display the list of subgroups of currently active group being edited
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'subgroups-list-pagination',
    pageSize: 5,
    currentPage: 1
  });

  // The search form
  searchForm;

  // Current search in edit group - groups search form
  currentSearchQuery: string;

  // Whether or not user has done a Groups search yet
  searchDone: boolean;

  // current active group being edited
  groupBeingEdited: Group;

  constructor(public groupDataService: GroupDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.currentSearchQuery = '';
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
    this.subs.push(this.groupDataService.getActiveGroup().subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        this.groupBeingEdited = activeGroup;
        this.forceUpdateGroups(activeGroup);
      }
    }));
  }

  /**
   * Event triggered when the user changes page on search result
   * @param event
   */
  onPageChangeSearch(event) {
    this.configSearch.currentPage = event;
    this.search({ query: this.currentSearchQuery });
  }

  /**
   * Event triggered when the user changes page on subgroups of active group
   * @param event
   */
  onPageChange(event) {
    this.subgroupsOfGroup = this.groupDataService.findAllByHref(this.groupBeingEdited._links.subgroups.href, {
      currentPage: event,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Whether or not the given group is a subgroup of the group currently being edited
   * @param possibleSubgroup Group that is a possible subgroup (being tested) of the group currently being edited
   */
  isSubgroupOfGroup(possibleSubgroup: Group): Observable<boolean> {
    return this.groupDataService.getActiveGroup().pipe(take(1),
      mergeMap((activeGroup: Group) => {
        if (activeGroup != null) {
          if (activeGroup.uuid === possibleSubgroup.uuid) {
            return observableOf(false);
          } else {
            return this.groupDataService.findAllByHref(activeGroup._links.subgroups.href, {
              currentPage: 0,
              elementsPerPage: Number.MAX_SAFE_INTEGER
            })
              .pipe(
                getSucceededRemoteData(),
                getRemoteDataPayload(),
                map((listTotalGroups: PaginatedList<Group>) => listTotalGroups.page.filter((groupInList: Group) => groupInList.id === possibleSubgroup.id)),
                map((groups: Group[]) => groups.length > 0))
          }
        } else {
          return observableOf(false);
        }
      }));
  }

  /**
   * Whether or not the given group is the current group being edited
   * @param group Group that is possibly the current group being edited
   */
  isActiveGroup(group: Group): Observable<boolean> {
    return this.groupDataService.getActiveGroup().pipe(take(1),
      mergeMap((activeGroup: Group) => {
        if (activeGroup != null && activeGroup.uuid === group.uuid) {
          return observableOf(true);
        }
        return observableOf(false);
      }));
  }

  /**
   * Deletes given subgroup from the group currently being edited
   * @param subgroup  Group we want to delete from the subgroups of the group currently being edited
   */
  deleteSubgroupFromGroup(subgroup: Group) {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        const response = this.groupDataService.deleteSubGroupFromGroup(activeGroup, subgroup);
        this.showNotifications('deleteSubgroup', response, subgroup.name, activeGroup);
        this.forceUpdateGroups(activeGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Adds given subgroup to the group currently being edited
   * @param subgroup  Subgroup to add to group currently being edited
   */
  addSubgroupToGroup(subgroup: Group) {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        if (activeGroup.uuid !== subgroup.uuid) {
          const response = this.groupDataService.addSubGroupToGroup(activeGroup, subgroup);
          this.showNotifications('addSubgroup', response, subgroup.name, activeGroup);
        } else {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.subgroupToAddIsActiveGroup'));
        }
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
    this.forceUpdateGroups(this.groupBeingEdited);
  }

  /**
   * Search in the groups (searches by group name and by uuid exact match)
   * @param data  Contains query param
   */
  search(data: any) {
    const query: string = data.query;
    if (query != null && this.currentSearchQuery !== query) {
      this.router.navigateByUrl(this.groupDataService.getGroupEditPageRouterLink(this.groupBeingEdited));
      this.currentSearchQuery = query;
      this.configSearch.currentPage = 1;
    }
    this.searchDone = true;
    this.groupsSearch = this.groupDataService.searchGroups(this.currentSearchQuery, {
      currentPage: this.configSearch.currentPage,
      elementsPerPage: this.configSearch.pageSize
    });
  }

  /**
   * Force-update the list of groups by first clearing the cache of results of this active groups' subgroups, then performing a new REST call
   * @param activeGroup   Group currently being edited
   */
  public forceUpdateGroups(activeGroup: Group) {
    this.groupDataService.clearGroupLinkRequests(activeGroup._links.subgroups.href);
    this.router.navigateByUrl(this.groupDataService.getGroupEditPageRouterLink(activeGroup));
    this.subgroupsOfGroup = this.groupDataService.findAllByHref(activeGroup._links.subgroups.href, {
      currentPage: this.config.currentPage,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Shows a notification based on the success/failure of the request
   * @param messageSuffix   Suffix for message
   * @param response        RestResponse observable containing success/failure request
   * @param nameObject      Object request was about
   * @param activeGroup     Group currently being edited
   */
  showNotifications(messageSuffix: string, response: Observable<RestResponse>, nameObject: string, activeGroup: Group) {
    response.pipe(take(1)).subscribe((restResponse: RestResponse) => {
      if (restResponse.isSuccessful) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.' + messageSuffix, { name: nameObject }));
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.' + messageSuffix, { name: nameObject }));
      }
    })
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
}
