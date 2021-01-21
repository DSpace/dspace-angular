import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf, Subscription, BehaviorSubject } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { EPerson } from '../../../../../core/eperson/models/eperson.model';
import { Group } from '../../../../../core/eperson/models/group.model';
import {
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
  getFirstCompletedRemoteData
} from '../../../../../core/shared/operators';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../../../shared/pagination/pagination-component-options.model';

/**
 * Keys to keep track of specific subscriptions
 */
enum SubKey {
  Members,
  ActiveGroup,
  SearchResults,
}

@Component({
  selector: 'ds-members-list',
  templateUrl: './members-list.component.html'
})
/**
 * The list of members in the edit group page
 */
export class MembersListComponent implements OnInit, OnDestroy {

  @Input()
  messagePrefix: string;

  /**
   * EPeople being displayed in search result, initially all members, after search result of search
   */
  searchResults$: BehaviorSubject<RemoteData<PaginatedList<EPerson>>> = new BehaviorSubject(undefined);
  /**
   * List of EPeople members of currently active group being edited
   */
  members$: BehaviorSubject<RemoteData<PaginatedList<EPerson>>> = new BehaviorSubject(undefined);

  /**
   * Pagination config used to display the list of EPeople that are result of EPeople search
   */
  configSearch: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'search-members-list-pagination',
    pageSize: 5,
    currentPage: 1
  });
  /**
   * Pagination config used to display the list of EPerson Membes of active group being edited
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'members-list-pagination',
    pageSize: 5,
    currentPage: 1
  });

  /**
   * Map of active subscriptions
   */
  subs: Map<SubKey, Subscription> = new Map();

  // The search form
  searchForm;

  // Current search in edit group - epeople search form
  currentSearchQuery: string;
  currentSearchScope: string;

  // Whether or not user has done a EPeople search yet
  searchDone: boolean;

  // current active group being edited
  groupBeingEdited: Group;

  constructor(private groupDataService: GroupDataService,
              public ePersonDataService: EPersonDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.currentSearchQuery = '';
    this.currentSearchScope = 'metadata';
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group(({
      scope: 'metadata',
      query: '',
    }));
    this.subs.set(SubKey.ActiveGroup, this.groupDataService.getActiveGroup().subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        this.groupBeingEdited = activeGroup;
        this.retrieveMembers(this.config.currentPage);
      }
    }));
  }

  /**
   * Event triggered when the user changes page on search result
   * @param event
   */
  onPageChangeSearch(event) {
    this.configSearch.currentPage = event;
    this.search({ scope: this.currentSearchScope, query: this.currentSearchQuery });
  }

  /**
   * Event triggered when the user changes page on EPerson embers of active group
   * @param event
   */
  onPageChange(event) {
    this.retrieveMembers(event);
  }

  /**
   * Retrieve the EPersons that are members of the group
   *
   * @param page the number of the page to retrieve
   * @private
   */
  private retrieveMembers(page: number) {
    this.unsubFrom(SubKey.Members);
    this.subs.set(
      SubKey.Members,
      this.ePersonDataService.findAllByHref(this.groupBeingEdited._links.epersons.href, {
        currentPage: page,
        elementsPerPage: this.config.pageSize
      }
    ).subscribe((rd: RemoteData<PaginatedList<EPerson>>) => {
      this.members$.next(rd);
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
   * Deletes a given EPerson from the members list of the group currently being edited
   * @param ePerson   EPerson we want to delete as member from group that is currently being edited
   */
  deleteMemberFromGroup(ePerson: EPerson) {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        const response = this.groupDataService.deleteMemberFromGroup(activeGroup, ePerson);
        this.showNotifications('deleteMember', response, ePerson.name, activeGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Adds a given EPerson to the members list of the group currently being edited
   * @param ePerson   EPerson we want to add as member to group that is currently being edited
   */
  addMemberToGroup(ePerson: EPerson) {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        const response = this.groupDataService.addMemberToGroup(activeGroup, ePerson);
        this.showNotifications('addMember', response, ePerson.name, activeGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Whether or not the given ePerson is a member of the group currently being edited
   * @param possibleMember  EPerson that is a possible member (being tested) of the group currently being edited
   */
  isMemberOfGroup(possibleMember: EPerson): Observable<boolean> {
    return this.groupDataService.getActiveGroup().pipe(take(1),
      mergeMap((group: Group) => {
        if (group != null) {
          return this.ePersonDataService.findAllByHref(group._links.epersons.href, {
            currentPage: 1,
            elementsPerPage: 9999
          })
            .pipe(
              getFirstSucceededRemoteData(),
              getRemoteDataPayload(),
              map((listEPeopleInGroup: PaginatedList<EPerson>) => listEPeopleInGroup.page.filter((ePersonInList: EPerson) => ePersonInList.id === possibleMember.id)),
              map((epeople: EPerson[]) => epeople.length > 0));
        } else {
          return observableOf(false);
        }
      }));
  }

  /**
   * Search in the EPeople by name, email or metadata
   * @param data  Contains scope and query param
   */
  search(data: any) {
    const query: string = data.query;
    const scope: string = data.scope;
    if (query != null && this.currentSearchQuery !== query && this.groupBeingEdited) {
      this.router.navigateByUrl(this.groupDataService.getGroupEditPageRouterLink(this.groupBeingEdited));
      this.currentSearchQuery = query;
      this.configSearch.currentPage = 1;
    }
    if (scope != null && this.currentSearchScope !== scope && this.groupBeingEdited) {
      this.router.navigateByUrl(this.groupDataService.getGroupEditPageRouterLink(this.groupBeingEdited));
      this.currentSearchScope = scope;
      this.configSearch.currentPage = 1;
    }
    this.searchDone = true;

    this.unsubFrom(SubKey.SearchResults);
    this.subs.set(SubKey.SearchResults, this.ePersonDataService.searchByScope(this.currentSearchScope, this.currentSearchQuery, {
      currentPage: this.configSearch.currentPage,
      elementsPerPage: this.configSearch.pageSize
    }).subscribe((rd: RemoteData<PaginatedList<EPerson>>) => {
      this.searchResults$.next(rd);
    }));
  }

  /**
   * unsub all subscriptions
   */
  ngOnDestroy(): void {
    for (const key of this.subs.keys()) {
      this.unsubFrom(key);
    }
  }

  /**
   * Shows a notification based on the success/failure of the request
   * @param messageSuffix   Suffix for message
   * @param response        RestResponse observable containing success/failure request
   * @param nameObject      Object request was about
   * @param activeGroup     Group currently being edited
   */
  showNotifications(messageSuffix: string, response: Observable<RemoteData<any>>, nameObject: string, activeGroup: Group) {
    response.pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<any>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.' + messageSuffix, { name: nameObject }));
        this.ePersonDataService.clearLinkRequests(activeGroup._links.epersons.href);
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
