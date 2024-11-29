import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
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
  Observable,
  of as observableOf,
} from 'rxjs';

import {
  EPersonListActionConfig,
  MembersListComponent,
} from '../../../../access-control/group-registry/group-form/members-list/members-list.component';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { EpersonDtoModel } from '../../../../core/eperson/models/eperson-dto.model';
import { Group } from '../../../../core/eperson/models/group.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { ContextHelpDirective } from '../../../../shared/context-help.directive';
import { hasValue } from '../../../../shared/empty.util';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';

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
  standalone: true,
  imports: [
    TranslateModule,
    ContextHelpDirective,
    ReactiveFormsModule,
    PaginationComponent,
    NgIf,
    AsyncPipe,
    RouterLink,
    NgClass,
    NgForOf,
  ],
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

  override ngOnInit(): void {
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
        this.unsubFrom(SubKey.ActiveGroup);
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
      const paginatedListOfEPersons: PaginatedList<EpersonDtoModel> = new PaginatedList();
      paginatedListOfEPersons.page = this.selectedReviewers.map((ePerson: EPerson) => Object.assign(new EpersonDtoModel(), {
        eperson: ePerson,
        ableToDelete: this.isMemberOfGroup(ePerson),
      }));
      this.ePeopleMembersOfGroup.next(paginatedListOfEPersons);
    } else {
      super.retrieveMembers(page);
    }
  }

  /**
   * Checks whether the given {@link possibleMember} is part of the {@link selectedReviewers}.
   *
   * @param possibleMember The {@link EPerson} that needs to be checked
   */
  isMemberOfGroup(possibleMember: EPerson): Observable<boolean> {
    return observableOf(hasValue(this.selectedReviewers.find((reviewer: EPerson) => reviewer.id === possibleMember.id)));
  }

  /**
   * Removes the {@link eperson} from the {@link selectedReviewers}
   *
   * @param eperson The {@link EPerson} to remove
   */
  deleteMemberFromGroup(eperson: EPerson) {
    const index = this.selectedReviewers.findIndex((reviewer: EPerson) => reviewer.id === eperson.id);
    if (index !== -1) {
      this.selectedReviewers.splice(index, 1);
    }
    this.retrieveMembers(this.config.currentPage);
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
    this.retrieveMembers(this.config.currentPage);
    this.selectedReviewersUpdated.emit(this.selectedReviewers);
  }

}
