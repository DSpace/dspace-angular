import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { Group } from '../../../core/eperson/models/group.model';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';

@Component({
  selector: 'ds-groups-registry',
  templateUrl: './groups-registry.component.html',
})
/**
 * A component used for managing all existing groups within the repository.
 * The admin can create, edit or delete groups here.
 */
export class GroupsRegistryComponent implements OnInit {

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
   * A list of all the current groups within the repository or the result of the search
   */
  groups: Observable<RemoteData<PaginatedList<Group>>>;

  // The search form
  searchForm;

  constructor(private groupService: GroupDataService,
              private ePersonDataService: EPersonDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
  }

  ngOnInit() {
    this.updateGroups({
      currentPage: 1,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Event triggered when the user changes page
   * @param event
   */
  onPageChange(event) {
    this.updateGroups({
      currentPage: event,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Update the list of groups by fetching it from the rest api or cache
   */
  private updateGroups(options) {
    this.groups = this.groupService.getGroups(options, followLink('epersons'), followLink('subgroups'));
  }

  /**
   * Search in the groups (searches by group name and by uuid exact match)
   * @param data  Contains query param
   */
  search(data: any) {
    const query: string = data.query;
    this.groups = this.groupService.searchGroups(query.trim(), {
      currentPage: 1,
      elementsPerPage: this.config.pageSize
    });
  }

  /**
   * Delete Group
   */
  deleteGroup(group: Group) {
    // TODO (backend)
    console.log('TODO implement editGroup', group);
    this.notificationsService.error('TODO implement deleteGroup (not yet implemented in backend)');
    if (hasValue(group.id)) {
      this.groupService.deleteGroup(group).pipe(take(1)).subscribe((success: boolean) => {
        if (success) {
          this.notificationsService.success(this.translateService.get(this.messagePrefix + 'notification.deleted.success', { name: group.name }));
          this.forceUpdateGroup();
        } else {
          this.notificationsService.error(this.translateService.get(this.messagePrefix + 'notification.deleted.failure', { name: group.name }));
        }
      })
    }
  }

  /**
   * Force-update the list of groups by first clearing the cache related to groups, then performing a new REST call
   */
  public forceUpdateGroup() {
    this.groupService.clearGroupsRequests();
    this.search({ query: '' })
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
   * Extract optional UUID from a group name => To be resolved to community or collection with link
   * (Or will be resolved in backend and added to group object, tbd) //TODO
   * @param groupName
   */
  getOptionalComColFromName(groupName: string): string {
    let optionalComColName = '';
    const uuidMatches = groupName.match(/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g);
    if (uuidMatches != null) {
      optionalComColName = uuidMatches[0];
    }
    return optionalComColName;
  }
}
