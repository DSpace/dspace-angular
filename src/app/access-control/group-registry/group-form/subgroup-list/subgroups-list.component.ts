import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { NoContent } from '../../../../core/shared/NoContent.model';
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
} from '../../../../core/shared/operators';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ContextHelpDirective } from '../../../../shared/context-help.directive';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';

/**
 * Keys to keep track of specific subscriptions
 */
enum SubKey {
  Members,
  ActiveGroup,
  SearchResults,
}

@Component({
  selector: 'ds-subgroups-list',
  templateUrl: './subgroups-list.component.html',
  imports: [
    AsyncPipe,
    ContextHelpDirective,
    PaginationComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
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
  searchResults$: BehaviorSubject<RemoteData<PaginatedList<Group>>> = new BehaviorSubject(undefined);
  /**
   * List of all subgroups of group being edited
   */
  subGroups$: BehaviorSubject<RemoteData<PaginatedList<Group>>> = new BehaviorSubject(undefined);

  subGroupsPageInfoState$: Observable<PageInfo>;

  /**
   * Map of active subscriptions
   */
  subs: Map<SubKey, Subscription> = new Map();

  /**
   * Pagination config used to display the list of groups that are result of groups search
   */
  configSearch: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'ssgl',
    pageSize: 5,
    currentPage: 1,
  });
  /**
   * Pagination config used to display the list of subgroups of currently active group being edited
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'sgl',
    pageSize: 5,
    currentPage: 1,
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
              private formBuilder: UntypedFormBuilder,
              private paginationService: PaginationService,
              private router: Router,
              public dsoNameService: DSONameService,
  ) {
    this.currentSearchQuery = '';
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
    this.subs.set(SubKey.ActiveGroup, this.groupDataService.getActiveGroup().subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        this.groupBeingEdited = activeGroup;
        this.retrieveSubGroups();
        this.search({ query: '' });
      }
    }));
    this.subGroupsPageInfoState$ = this.subGroups$.pipe(
      map(subGroupsRD => subGroupsRD?.payload?.pageInfo),
    );
  }

  /**
   * Retrieve the Subgroups that are members of the group
   *
   * @param page the number of the page to retrieve
   * @private
   */
  private retrieveSubGroups() {
    this.unsubFrom(SubKey.Members);
    this.subs.set(
      SubKey.Members,
      this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
        switchMap((config) => this.groupDataService.findListByHref(this.groupBeingEdited._links.subgroups.href, {
          currentPage: config.currentPage,
          elementsPerPage: config.pageSize,
        },
        true,
        true,
        followLink('object'),
        )),
      ).subscribe((rd: RemoteData<PaginatedList<Group>>) => {
        this.subGroups$.next(rd);
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
        this.showNotifications('deleteSubgroup', response, this.dsoNameService.getName(subgroup), activeGroup);
        // Reload search results (if there is an active query).
        // This will potentially add this deleted subgroup into the list of search results.
        if (this.currentSearchQuery != null) {
          this.search({ query: this.currentSearchQuery });
        }
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
          this.showNotifications('addSubgroup', response, this.dsoNameService.getName(subgroup), activeGroup);
          // Reload search results (if there is an active query).
          // This will potentially remove this added subgroup from search results.
          if (this.currentSearchQuery != null) {
            this.search({ query: this.currentSearchQuery });
          }
        } else {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.subgroupToAddIsActiveGroup'));
        }
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Search all non-member groups (searches by group name and by uuid exact match).  Used to search for
   * groups that could be added to current group as a subgroup.
   * @param data  Contains query param
   */
  search(data: any) {
    this.unsubFrom(SubKey.SearchResults);
    this.subs.set(SubKey.SearchResults,
      this.paginationService.getCurrentPagination(this.configSearch.id, this.configSearch).pipe(
        switchMap((paginationOptions) => {
          const query: string = data.query;
          if (query != null && this.currentSearchQuery !== query && this.groupBeingEdited) {
            this.currentSearchQuery = query;
            this.paginationService.resetPage(this.configSearch.id);
          }
          this.searchDone = true;

          return this.groupDataService.searchNonMemberGroups(this.currentSearchQuery, this.groupBeingEdited.id, {
            currentPage: paginationOptions.currentPage,
            elementsPerPage: paginationOptions.pageSize,
          }, false, true, followLink('object'));
        }),
        getAllCompletedRemoteData(),
        map((rd: RemoteData<any>) => {
          if (rd.hasFailed) {
            this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure', { cause: rd.errorMessage }));
          } else {
            return rd;
          }
        }))
        .subscribe((rd: RemoteData<PaginatedList<Group>>) => {
          this.searchResults$.next(rd);
        }));
  }

  /**
   * Unsubscribe from a subscription if it's still subscribed, and remove it from the map of
   * active subscriptions
   *
   * @param key The key of the subscription to unsubscribe from
   * @private
   */
  private unsubFrom(key: SubKey) {
    if (this.subs.has(key)) {
      this.subs.get(key).unsubscribe();
      this.subs.delete(key);
    }
  }

  /**
   * unsub all subscriptions
   */
  ngOnDestroy(): void {
    for (const key of this.subs.keys()) {
      this.unsubFrom(key);
    }
    this.paginationService.clearPagination(this.config.id);
    this.paginationService.clearPagination(this.configSearch.id);
  }

  /**
   * Shows a notification based on the success/failure of the request
   * @param messageSuffix   Suffix for message
   * @param response        RestResponse observable containing success/failure request
   * @param nameObject      Object request was about
   * @param activeGroup     Group currently being edited
   */
  showNotifications(messageSuffix: string, response: Observable<RemoteData<Group|NoContent>>, nameObject: string, activeGroup: Group) {
    response.pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<Group>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.' + messageSuffix, { name: nameObject }));
        this.groupDataService.clearGroupLinkRequests(activeGroup._links.subgroups.href);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.' + messageSuffix, { name: nameObject }));
      }
    });
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
