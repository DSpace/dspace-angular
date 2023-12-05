import { CommonModule } from '@angular/common';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
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
import { MembersListComponent } from './members-list.component';
import { EPersonMock, EPersonMock2 } from '../../../../shared/testing/eperson.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { getMockTranslateService } from '../../../../shared/mocks/translate.service.mock';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { RouterMock } from '../../../../shared/mocks/router.mock';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';

describe('MembersListComponent', () => {
  let component: MembersListComponent;
  let fixture: ComponentFixture<MembersListComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let activeGroup;
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
      searchNonMembers(query: string, group: string): Observable<RemoteData<PaginatedList<EPerson>>> {
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
      declarations: [MembersListComponent],
      providers: [MembersListComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        { provide: Router, useValue: new RouterMock() },
        { provide: PaginationService, useValue: paginationService },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(fakeAsync(() => {
    fixture.destroy();
    fixture.debugElement.nativeElement.remove();
    flush();
    component = null;
    fixture.debugElement.nativeElement.remove();
  }));

  it('should create MembersListComponent', inject([MembersListComponent], (comp: MembersListComponent) => {
    expect(comp).toBeDefined();
  }));

  describe('current members list', () => {
    it('should show list of eperson members of current active group', () => {
      const epersonIdsFound = fixture.debugElement.queryAll(By.css('#ePeopleMembersOfGroup tr td:first-child'));
      expect(epersonIdsFound.length).toEqual(1);
      epersonMembers.map((eperson: EPerson) => {
        expect(epersonIdsFound.find((foundEl) => {
          return (foundEl.nativeElement.textContent.trim() === eperson.uuid);
        })).toBeTruthy();
      });
    });

    it('should show a delete button next to each member', () => {
      const epersonsFound = fixture.debugElement.queryAll(By.css('#ePeopleMembersOfGroup tbody tr'));
      epersonsFound.map((foundEPersonRowElement: DebugElement) => {
        const addButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-plus'));
        const deleteButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-trash-alt'));
        expect(addButton).toBeNull();
        expect(deleteButton).not.toBeNull();
      });
    });

    describe('if first delete button is pressed', () => {
      beforeEach(() => {
        const deleteButton: DebugElement = fixture.debugElement.query(By.css('#ePeopleMembersOfGroup tbody .fa-trash-alt'));
        deleteButton.nativeElement.click();
        fixture.detectChanges();
      });
      it('then no ePerson remains as a member of the active group.', () => {
        const epersonsFound = fixture.debugElement.queryAll(By.css('#ePeopleMembersOfGroup tbody tr'));
        expect(epersonsFound.length).toEqual(0);
      });
    });
  });

  describe('search', () => {
    describe('when searching without query', () => {
      let epersonsFound: DebugElement[];
      beforeEach(fakeAsync(() => {
        component.search({ scope: 'metadata', query: '' });
        tick();
        fixture.detectChanges();
        epersonsFound = fixture.debugElement.queryAll(By.css('#epersonsSearch tbody tr'));
      }));

      it('should display only non-members of the group', () => {
        const epersonIdsFound = fixture.debugElement.queryAll(By.css('#epersonsSearch tbody tr td:first-child'));
        expect(epersonIdsFound.length).toEqual(1);
        epersonNonMembers.map((eperson: EPerson) => {
          expect(epersonIdsFound.find((foundEl) => {
            return (foundEl.nativeElement.textContent.trim() === eperson.uuid);
          })).toBeTruthy();
        });
      });

      it('should display an add button next to non-members, not a delete button', () => {
        epersonsFound.map((foundEPersonRowElement: DebugElement) => {
          const addButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-plus'));
          const deleteButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-trash-alt'));
          expect(addButton).not.toBeNull();
          expect(deleteButton).toBeNull();
        });
      });

      describe('if first add button is pressed', () => {
        beforeEach(() => {
          const addButton: DebugElement = fixture.debugElement.query(By.css('#epersonsSearch tbody .fa-plus'));
          addButton.nativeElement.click();
          fixture.detectChanges();
        });
        it('then all (two) ePersons are member of the active group. No non-members left', () => {
          epersonsFound = fixture.debugElement.queryAll(By.css('#epersonsSearch tbody tr'));
          expect(epersonsFound.length).toEqual(0);
        });
      });
    });
  });

});
