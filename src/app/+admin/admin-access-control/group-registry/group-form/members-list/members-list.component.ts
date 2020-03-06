import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
   * EPeople being displayed, initially all members, after search result of search
   */
  ePeople: Observable<RemoteData<PaginatedList<EPerson>>>;

  /**
   * Pagination config used to display the list of EPeople
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

  /**
   * Whether or not user has done a search yet
   */
  searchDone: boolean;

  constructor(private groupDataService: GroupDataService,
              public ePersonDataService: EPersonDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.subs.push(this.groupDataService.getActiveGroup().subscribe((group: Group) => {
      if (group != null) {
        this.ePeople = this.ePersonDataService.findAllByHref(group._links.epersons.href, {
          currentPage: 1,
          elementsPerPage: this.config.pageSize
        })
      }
    }));
    this.searchForm = this.formBuilder.group(({
      scope: 'metadata',
      query: '',
    }));
    this.searchDone = false;
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.updateMembers({
      currentPage: event,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Update the list of members by fetching it from the rest api or cache
   */
  private updateMembers(options) {
    this.ePeople = this.ePersonDataService.getEPeople(options);
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
        this.forceUpdateEPeople(activeGroup);
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
    this.searchDone = true;
    this.ePeople = this.ePersonDataService.searchByScope(data.scope, data.query, {
      currentPage: 1,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Force-update the list of EPeople by first clearing the cache related to EPeople, then performing
   * a new REST call
   * @param activeGroup   Group currently being edited
   */
  public forceUpdateEPeople(activeGroup: Group) {
    this.groupDataService.clearGroupsRequests();
    this.ePersonDataService.clearEPersonRequests();
    this.ePeople = this.ePersonDataService.findAllByHref(activeGroup._links.epersons.href, {
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
