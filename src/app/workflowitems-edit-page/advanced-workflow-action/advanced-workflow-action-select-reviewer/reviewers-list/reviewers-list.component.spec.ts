import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, SimpleChange, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { RestResponse } from '../../../../core/cache/response.models';
import { buildPaginatedList, PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { Group } from '../../../../core/eperson/models/group.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { GroupMock } from '../../../../shared/testing/group-mock';
import { ReviewersListComponent } from './reviewers-list.component';
import { EPersonMock, EPersonMock2 } from '../../../../shared/testing/eperson.mock';
import {
  createSuccessfulRemoteDataObject$,
  createNoContentRemoteDataObject$
} from '../../../../shared/remote-data.utils';
import { getMockTranslateService } from '../../../../shared/mocks/translate.service.mock';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { RouterMock } from '../../../../shared/mocks/router.mock';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';

// NOTE: Because ReviewersListComponent extends MembersListComponent, the below tests ONLY validate
// features which are *unique* to ReviewersListComponent. All other features are tested in the
// members-list.component.spec.ts file.
describe('ReviewersListComponent', () => {
  let component: ReviewersListComponent;
  let fixture: ComponentFixture<ReviewersListComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let activeGroup: Group;
  let epersonMembers: EPerson[];
  let epersonNonMembers: EPerson[];
  let paginationService;

  beforeEach(waitForAsync(() => {
    activeGroup = GroupMock;
    epersonMembers = [EPersonMock2];
    epersonNonMembers = [EPersonMock];
    ePersonDataServiceStub = {
      activeGroup: activeGroup,
      epersonMembers: epersonMembers,
      epersonNonMembers: epersonNonMembers,
      // This method is used to get all the current members
      findListByHref(_href: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        return createSuccessfulRemoteDataObject$(buildPaginatedList<EPerson>(new PageInfo(), groupsDataServiceStub.getEPersonMembers()));
      },
      // This method is used to search across *non-members*
      searchByScope(scope: string, query: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), epersonNonMembers));
        }
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
      },
      clearEPersonRequests() {
        // empty
      },
      clearLinkRequests() {
        // empty
      },
      getEPeoplePageRouterLink(): string {
        return '/access-control/epeople';
      }
    };
    groupsDataServiceStub = {
      activeGroup: activeGroup,
      epersonMembers: epersonMembers,
      epersonNonMembers: epersonNonMembers,
      getActiveGroup(): Observable<Group> {
        return observableOf(activeGroup);
      },
      getEPersonMembers() {
        return this.epersonMembers;
      },
      addMemberToGroup(parentGroup, epersonToAdd: EPerson): Observable<RestResponse> {
        // Add eperson to list of members
        this.epersonMembers = [...this.epersonMembers, epersonToAdd];
        // Remove eperson from list of non-members
        this.epersonNonMembers.forEach( (eperson: EPerson, index: number) => {
          if (eperson.id === epersonToAdd.id) {
            this.epersonNonMembers.splice(index, 1);
          }
        });
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      clearGroupsRequests() {
        // empty
      },
      clearGroupLinkRequests() {
        // empty
      },
      getGroupEditPageRouterLink(group: Group): string {
        return '/access-control/groups/' + group.id;
      },
      deleteMemberFromGroup(parentGroup, epersonToDelete: EPerson): Observable<RestResponse> {
        // Remove eperson from list of members
        this.epersonMembers.forEach( (eperson: EPerson, index: number) => {
          if (eperson.id === epersonToDelete.id) {
            this.epersonMembers.splice(index, 1);
          }
        });
        // Add eperson to list of non-members
        this.epersonNonMembers = [...this.epersonNonMembers, epersonToDelete];
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      // Used to find the currently active group
      findById(id: string) {
        if (activeGroup.id === id) {
          return createSuccessfulRemoteDataObject$(activeGroup);
        }
        return createNoContentRemoteDataObject$();
      },
      editGroup() {
        // empty
      }
    };
    builderService = getMockFormBuilderService();
    translateService = getMockTranslateService();

    paginationService = new PaginationServiceStub();
    return TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ReviewersListComponent],
      providers: [ReviewersListComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        { provide: Router, useValue: new RouterMock() },
        { provide: PaginationService, useValue: paginationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(fakeAsync(() => {
    fixture.destroy();
    flush();
    component = null;
    fixture.debugElement.nativeElement.remove();
  }));


  describe('when no group is selected', () => {
    beforeEach(() => {
      component.ngOnChanges({
        groupId: new SimpleChange(undefined, null, true)
      });
      fixture.detectChanges();
    });

    it('should show no ePersons because no group is selected', () => {
      const ePersonIdsFound = fixture.debugElement.queryAll(By.css('#ePeopleMembersOfGroup tr td:first-child'));
      expect(ePersonIdsFound.length).toEqual(0);
      epersonMembers.map((ePerson: EPerson) => {
        expect(ePersonIdsFound.find((foundEl) => {
          return (foundEl.nativeElement.textContent.trim() === ePerson.uuid);
        })).not.toBeTruthy();
      });
    });
  });

  describe('when a group is selected', () => {
    beforeEach(() => {
      component.ngOnChanges({
        groupId: new SimpleChange(undefined, GroupMock.id, true)
      });
      fixture.detectChanges();
    });

    it('should show all ePerson members of group', () => {
      const ePersonIdsFound = fixture.debugElement.queryAll(By.css('#ePeopleMembersOfGroup tr td:first-child'));
      expect(ePersonIdsFound.length).toEqual(1);
      epersonMembers.map((ePerson: EPerson) => {
        expect(ePersonIdsFound.find((foundEl: DebugElement) => {
          return (foundEl.nativeElement.textContent.trim() === ePerson.uuid);
        })).toBeTruthy();
      });
    });
  });


  it('should replace the value when a new member is added when multipleReviewers is false', () => {
    spyOn(component.selectedReviewersUpdated, 'emit');
    component.multipleReviewers = false;
    component.selectedReviewers = [EPersonMock];

    component.addMemberToGroup(EPersonMock2);

    expect(component.selectedReviewers).toEqual([EPersonMock2]);
    expect(component.selectedReviewersUpdated.emit).toHaveBeenCalledWith([EPersonMock2]);
  });

  it('should add the value when a new member is added when multipleReviewers is true', () => {
    spyOn(component.selectedReviewersUpdated, 'emit');
    component.multipleReviewers = true;
    component.selectedReviewers = [EPersonMock];

    component.addMemberToGroup(EPersonMock2);

    expect(component.selectedReviewers).toEqual([EPersonMock, EPersonMock2]);
    expect(component.selectedReviewersUpdated.emit).toHaveBeenCalledWith([EPersonMock, EPersonMock2]);
  });

  it('should delete the member when present', () => {
    spyOn(component.selectedReviewersUpdated, 'emit');
    component.selectedReviewers = [EPersonMock];

    component.deleteMemberFromGroup(EPersonMock);

    expect(component.selectedReviewers).toEqual([]);
    expect(component.selectedReviewersUpdated.emit).toHaveBeenCalledWith([]);
  });

});
