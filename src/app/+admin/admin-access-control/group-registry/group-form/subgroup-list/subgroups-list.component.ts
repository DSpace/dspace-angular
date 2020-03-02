import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
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
      }))
  }

  deleteSubgroupFromGroup(group: Group) {
    // TODO
    console.log('deleteSubgroup TODO', group);
    // this.forceUpdateGroup();
  }

  addSubgroupToGroup(group: Group) {
    // TODO
    console.log('addSubgroup TODO', group);
    // this.forceUpdateGroup();
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
   */
  public forceUpdateGroup() {
    this.groupDataService.clearGroupsRequests();
    this.search({ query: '' })
  }

  /**
   * unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
