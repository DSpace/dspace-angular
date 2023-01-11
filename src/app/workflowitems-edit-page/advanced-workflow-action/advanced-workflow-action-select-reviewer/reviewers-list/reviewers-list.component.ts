import { Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { EpersonDtoModel } from '../../../../core/eperson/models/eperson-dto.model';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { Observable, of as observableOf } from 'rxjs';
import { hasValue } from '../../../../shared/empty.util';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import {
  MembersListComponent, EPersonListActionConfig
} from '../../../../access-control/group-registry/group-form/members-list/members-list.component';

/**
 * Keys to keep track of specific subscriptions
 */
enum SubKey {
  ActiveGroup,
  MembersDTO,
  SearchResultsDTO,
}

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

  selectedReviewers: EpersonDtoModel[] = [];

  constructor(protected groupService: GroupDataService,
              public ePersonDataService: EPersonDataService,
              translateService: TranslateService,
              notificationsService: NotificationsService,
              formBuilder: FormBuilder,
              paginationService: PaginationService,
              router: Router) {
    super(groupService, ePersonDataService, translateService, notificationsService, formBuilder, paginationService, router);
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

  retrieveMembers(page: number): void {
    this.config.currentPage = page;
    if (this.groupId === null) {
      this.unsubFrom(SubKey.MembersDTO);
      const paginatedListOfDTOs: PaginatedList<EpersonDtoModel> = new PaginatedList();
      paginatedListOfDTOs.page = this.selectedReviewers;
      this.ePeopleMembersOfGroupDtos.next(paginatedListOfDTOs);
    } else {
      super.retrieveMembers(page);
    }
  }

  isMemberOfGroup(possibleMember: EPerson): Observable<boolean> {
    return observableOf(hasValue(this.selectedReviewers.find((reviewer: EpersonDtoModel) => reviewer.eperson.id === possibleMember.id)));
  }

  deleteMemberFromGroup(ePerson: EpersonDtoModel) {
    ePerson.memberOfGroup = false;
    const index = this.selectedReviewers.indexOf(ePerson);
    if (index !== -1) {
      this.selectedReviewers.splice(index, 1);
    }
    this.selectedReviewersUpdated.emit(this.selectedReviewers.map((epersonDtoModel: EpersonDtoModel) => epersonDtoModel.eperson));
  }

  addMemberToGroup(ePerson: EpersonDtoModel) {
    ePerson.memberOfGroup = true;
    if (!this.multipleReviewers) {
      for (const selectedReviewer of this.selectedReviewers) {
        selectedReviewer.memberOfGroup = false;
      }
      this.selectedReviewers = [];
    }
    this.selectedReviewers.push(ePerson);
    this.selectedReviewersUpdated.emit(this.selectedReviewers.map((epersonDtoModel: EpersonDtoModel) => epersonDtoModel.eperson));
  }

}
