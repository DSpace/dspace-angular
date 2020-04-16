import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { RestResponse } from '../../../../../core/cache/response.models';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { RemoteData } from '../../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { EPerson } from '../../../../../core/eperson/models/eperson.model';
import { Group } from '../../../../../core/eperson/models/group.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { hasValue } from '../../../../../shared/empty.util';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../../../shared/pagination/pagination-component-options.model';

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
  ePeopleSearch: Observable<RemoteData<PaginatedList<EPerson>>>;
  /**
   * List of EPeople members of currently active group being edited
   */
  ePeopleMembersOfGroup: Observable<RemoteData<PaginatedList<EPerson>>>;

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
   * List of subscriptions
   */
  subs: Subscription[] = [];

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
    this.subs.push(this.groupDataService.getActiveGroup().subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        this.groupBeingEdited = activeGroup;
        this.forceUpdateEPeople(activeGroup);
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
    this.ePeopleMembersOfGroup = this.ePersonDataService.findAllByHref(this.groupBeingEdited._links.epersons.href, {
      currentPage: event,
      elementsPerPage: this.config.pageSize
    })
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
        this.forceUpdateEPeople(activeGroup);
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
    this.forceUpdateEPeople(this.groupBeingEdited, ePerson);
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
            currentPage: 0,
            elementsPerPage: Number.MAX_SAFE_INTEGER
          })
            .pipe(
              getSucceededRemoteData(),
              getRemoteDataPayload(),
              map((listEPeopleInGroup: PaginatedList<EPerson>) => listEPeopleInGroup.page.filter((ePersonInList: EPerson) => ePersonInList.id === possibleMember.id)),
              map((epeople: EPerson[]) => epeople.length > 0))
        } else {
          return observableOf(false);
        }
      }))
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
    this.ePeopleSearch = this.ePersonDataService.searchByScope(this.currentSearchScope, this.currentSearchQuery, {
      currentPage: this.configSearch.currentPage,
      elementsPerPage: this.configSearch.pageSize
    });
  }

  /**
   * Force-update the list of EPeople by first clearing the cache related to EPeople, then performing
   * a new REST call
   * @param activeGroup   Group currently being edited
   */
  public forceUpdateEPeople(activeGroup: Group, ePersonToUpdate?: EPerson) {
    if (ePersonToUpdate != null) {
      this.ePersonDataService.clearLinkRequests(ePersonToUpdate._links.groups.href);
    }
    this.ePersonDataService.clearLinkRequests(activeGroup._links.epersons.href);
    this.router.navigateByUrl(this.groupDataService.getGroupEditPageRouterLink(activeGroup));
    this.ePeopleMembersOfGroup = this.ePersonDataService.findAllByHref(activeGroup._links.epersons.href, {
      currentPage: this.configSearch.currentPage,
      elementsPerPage: this.configSearch.pageSize
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
