import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { followLink } from '../../../../../shared/utils/follow-link-config.model';

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
   * Groups being displayed, initially all subgroups, after search result of search
   */
  groups: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Pagination config used to display the list of subgroups
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'subgroups-list-pagination',
    pageSize: 5,
    currentPage: 1
  });

  // The search form
  searchForm;

  /**
   * Whether or not user has done a search yet
   */
  searchDone: boolean;

  constructor(public groupDataService: GroupDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.subs.push(this.groupDataService.getActiveGroup().subscribe((group: Group) => {
      if (group != null) {
        this.groups = this.groupDataService.findAllByHref(group._links.groups.href, {
          currentPage: 1,
          elementsPerPage: this.config.pageSize
        })
      }
    }));
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
    this.searchDone = false;
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.updateSubgroups({
      currentPage: event,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Update the list of subgroups by fetching it from the rest api or cache
   */
  private updateSubgroups(options) {
    this.groups = this.groupDataService.getGroups(options);
  }

  /**
   * Whether or not the given group is a subgroup of the group currently being edited
   * @param possibleSubgroup Group that is a possible subgroup (being tested) of the group currently being edited
   */
  isSubgroupOfGroup(possibleSubgroup: Group): Observable<boolean> {
    return this.groupDataService.getActiveGroup().pipe(take(1),
      mergeMap((group: Group) => {
        if (group != null) {
          return this.groupDataService.findAllByHref(group._links.groups.href, {
            currentPage: 0,
            elementsPerPage: Number.MAX_SAFE_INTEGER
          })
            .pipe(
              getSucceededRemoteData(),
              getRemoteDataPayload(),
              map((listTotalGroups: PaginatedList<Group>) => listTotalGroups.page.filter((groupInList: Group) => groupInList.id === possibleSubgroup.id)),
              map((groups: Group[]) => groups.length > 0))
        } else {
          return observableOf(false);
        }
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
        this.showNotifications('addSubgroup', response, subgroup.name, activeGroup);
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
        const response = this.groupDataService.addSubGroupToGroup(activeGroup, subgroup);
        this.showNotifications('deleteSubgroup', response, subgroup.name, activeGroup);
        this.forceUpdateGroups(activeGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Search in the groups (searches by group name and by uuid exact match)
   * @param data  Contains query param
   */
  search(data: any) {
    this.searchDone = true;
    const query: string = data.query;
    this.groups = this.groupDataService.searchGroups(query.trim(), {
      currentPage: 1,
      elementsPerPage: this.config.pageSize
    }, followLink('epersons'));
  }

  /**
   * Force-update the list of groups by first clearing the cache related to groups, then performing a new REST call
   * @param activeGroup   Group currently being edited
   */
  public forceUpdateGroups(activeGroup: Group) {
    this.groupDataService.clearGroupsRequests();
    this.groups = this.groupDataService.findAllByHref(activeGroup._links.groups.href, {
      currentPage: 1,
      elementsPerPage: this.config.pageSize
    })
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
}
