import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
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
              private ePersonDataService: EPersonDataService,
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

  deleteMemberFromGroup(ePerson: EPerson) {
    // TODO
    console.log('deleteMember TODO', ePerson);
    // this.forceUpdateEPeople();
  }

  addMemberToGroup(ePerson: EPerson) {
    // TODO
    console.log('addMember TODO', ePerson);
    // this.forceUpdateEPeople();
  }

  isMemberOfGroup(ePerson: EPerson): Observable<boolean> {
    return this.groupDataService.getActiveGroup().pipe(take(1),
      mergeMap((group: Group) => {
        if (group != null) {
          return this.groupDataService.findAllByHref(ePerson._links.groups.href, {
            currentPage: 0,
            elementsPerPage: Number.MAX_SAFE_INTEGER
          })
            .pipe(
              getSucceededRemoteData(),
              getRemoteDataPayload(),
              map((listTotalGroups: PaginatedList<Group>) => listTotalGroups.page.filter((groupInList: Group) => groupInList.id === group.id)),
              map((groups: Group[]) => groups.length > 0))
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
   */
  public forceUpdateEPeople() {
    this.ePersonDataService.clearEPersonRequests();
    this.search({ query: '', scope: 'metadata' })
  }

  /**
   * unsub all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
