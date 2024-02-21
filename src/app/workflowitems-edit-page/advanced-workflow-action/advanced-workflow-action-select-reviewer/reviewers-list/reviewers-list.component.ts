import { Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import {
  MembersListComponent,
  EPersonListActionConfig,
} from '../../../../access-control/group-registry/group-form/members-list/members-list.component';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';

/**
 * Keys to keep track of specific subscriptions
 */
enum SubKey {
  ActiveGroup,
  Members,
  SearchResults,
}

/**
 * A custom {@link MembersListComponent} for the advanced SelectReviewer workflow.
 */
@Component({
  selector: 'ds-reviewers-list',
  // templateUrl: './reviewers-list.component.html',
  templateUrl: '../../../../access-control/group-registry/group-form/members-list/members-list.component.html',
})
export class ReviewersListComponent extends MembersListComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  groupId: string | null;

  @Input()
  actionConfig: EPersonListActionConfig;

  @Input()
  multipleReviewers: boolean;

  @Output()
  selectedReviewersUpdated: EventEmitter<EPerson[]> = new EventEmitter();

  selectedReviewers: EPerson[] = [];

  constructor(
    protected groupService: GroupDataService,
    public ePersonDataService: EPersonDataService,
    protected translateService: TranslateService,
    protected notificationsService: NotificationsService,
    protected formBuilder: UntypedFormBuilder,
    protected paginationService: PaginationService,
    protected router: Router,
    public dsoNameService: DSONameService,
  ) {
    super(groupService, ePersonDataService, translateService, notificationsService, formBuilder, paginationService, router, dsoNameService);
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group(({
      scope: 'metadata',
      query: '',
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.groupId = changes.groupId.currentValue;
    if (changes.groupId.currentValue !== changes.groupId.previousValue) {
      if (this.groupId === null) {
        this.retrieveMembers(this.config.currentPage);
      } else {
        this.subs.set(SubKey.ActiveGroup, this.groupService.findById(this.groupId).pipe(
          getFirstSucceededRemoteDataPayload(),
        ).subscribe((activeGroup: Group) => {
          if (activeGroup != null) {
            this.groupDataService.editGroup(activeGroup);
            this.groupBeingEdited = activeGroup;
            this.retrieveMembers(this.config.currentPage);
          }
        }));
      }
    }
  }

  /**
   * Sets the list of currently selected members, when no group is defined the list of {@link selectedReviewers}
   * will be set.
   *
   *  @param page The number of the page to retrieve
   */
  retrieveMembers(page: number): void {
    this.config.currentPage = page;
    if (this.groupId === null) {
      this.unsubFrom(SubKey.Members);
      const paginatedListOfEPersons: PaginatedList<EPerson> = new PaginatedList();
      paginatedListOfEPersons.page = this.selectedReviewers;
      this.ePeopleMembersOfGroup.next(paginatedListOfEPersons);
    } else {
      super.retrieveMembers(page);
    }
  }

  /**
   * Removes the {@link eperson} from the {@link selectedReviewers}
   *
   * @param eperson The {@link EPerson} to remove
   */
  deleteMemberFromGroup(eperson: EPerson) {
    const index = this.selectedReviewers.indexOf(eperson);
    if (index !== -1) {
      this.selectedReviewers.splice(index, 1);
    }
    this.selectedReviewersUpdated.emit(this.selectedReviewers);
  }

  /**
   * Adds the {@link eperson} to the {@link selectedReviewers} (or replaces it when {@link multipleReviewers} is
   * `false`). Afterwards it will emit the list.
   *
   * @param eperson The {@link EPerson} to add to the list
   */
  addMemberToGroup(eperson: EPerson) {
    if (!this.multipleReviewers) {
      this.selectedReviewers = [];
    }
    this.selectedReviewers.push(eperson);
    this.selectedReviewersUpdated.emit(this.selectedReviewers);
  }

}
