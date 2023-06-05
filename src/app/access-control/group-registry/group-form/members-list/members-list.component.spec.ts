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
import { GroupMock, GroupMock2 } from '../../../../shared/testing/group-mock';
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
  let allEPersons: EPerson[];
  let allGroups: Group[];
  let epersonMembers: EPerson[];
  let subgroupMembers: Group[];
  let paginationService;

  beforeEach(waitForAsync(() => {
    activeGroup = GroupMock;
    epersonMembers = [EPersonMock2];
    subgroupMembers = [GroupMock2];
    allEPersons = [EPersonMock, EPersonMock2];
    allGroups = [GroupMock, GroupMock2];
    ePersonDataServiceStub = {
      activeGroup: activeGroup,
      epersonMembers: epersonMembers,
      subgroupMembers: subgroupMembers,
      findListByHref(_href: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        return createSuccessfulRemoteDataObject$(buildPaginatedList<EPerson>(new PageInfo(), groupsDataServiceStub.getEPersonMembers()));
      },
      searchByScope(scope: string, query: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), allEPersons));
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
      subgroupMembers: subgroupMembers,
      allGroups: allGroups,
      getActiveGroup(): Observable<Group> {
        return observableOf(activeGroup);
      },
      getEPersonMembers() {
        return this.epersonMembers;
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), this.allGroups));
        }
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
      },
      addMemberToGroup(parentGroup, eperson: EPerson): Observable<RestResponse> {
        this.epersonMembers = [...this.epersonMembers, eperson];
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
        this.epersonMembers = this.epersonMembers.find((eperson: EPerson) => {
          if (eperson.id !== epersonToDelete.id) {
            return eperson;
          }
        });
        if (this.epersonMembers === undefined) {
          this.epersonMembers = [];
        }
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

  it('should show list of eperson members of current active group', () => {
    const epersonIdsFound = fixture.debugElement.queryAll(By.css('#ePeopleMembersOfGroup tr td:first-child'));
    expect(epersonIdsFound.length).toEqual(1);
    epersonMembers.map((eperson: EPerson) => {
      expect(epersonIdsFound.find((foundEl) => {
        return (foundEl.nativeElement.textContent.trim() === eperson.uuid);
      })).toBeTruthy();
    });
  });

  describe('search', () => {
    describe('when searching without query', () => {
      let epersonsFound: DebugElement[];
      beforeEach(fakeAsync(() => {
        spyOn(component, 'isMemberOfGroup').and.callFake((ePerson: EPerson) => {
          return observableOf(activeGroup.epersons.includes(ePerson));
        });
        component.search({ scope: 'metadata', query: '' });
        tick();
        fixture.detectChanges();
        epersonsFound = fixture.debugElement.queryAll(By.css('#epersonsSearch tbody tr'));
        // Stop using the fake spy function (because otherwise the clicking on the buttons will not change anything
        // because they don't change the value of activeGroup.epersons)
        jasmine.getEnv().allowRespy(true);
        spyOn(component, 'isMemberOfGroup').and.callThrough();
      }));

      it('should display all epersons', () => {
        expect(epersonsFound.length).toEqual(2);
      });

      describe('if eperson is already a eperson', () => {
        it('should have delete button, else it should have add button', () => {
          const memberIds: string[] = activeGroup.epersons.map((ePerson: EPerson) => ePerson.id);
          epersonsFound.map((foundEPersonRowElement: DebugElement) => {
            const epersonId: DebugElement = foundEPersonRowElement.query(By.css('td:first-child'));
            const addButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-plus'));
            const deleteButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-trash-alt'));
            if (memberIds.includes(epersonId.nativeElement.textContent)) {
              expect(addButton).toBeNull();
              expect(deleteButton).not.toBeNull();
            } else {
              expect(deleteButton).toBeNull();
              expect(addButton).not.toBeNull();
            }
          });
        });
      });

      describe('if first add button is pressed', () => {
        beforeEach(fakeAsync(() => {
          const addButton: DebugElement = fixture.debugElement.query(By.css('#epersonsSearch tbody .fa-plus'));
          addButton.nativeElement.click();
          tick();
          fixture.detectChanges();
        }));
        it('then all the ePersons are member of the active group', () => {
          epersonsFound = fixture.debugElement.queryAll(By.css('#epersonsSearch tbody tr'));
          expect(epersonsFound.length).toEqual(2);
          epersonsFound.map((foundEPersonRowElement: DebugElement) => {
            const addButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-plus'));
            const deleteButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-trash-alt'));
            expect(addButton).toBeNull();
            expect(deleteButton).not.toBeNull();
          });
        });
      });

      describe('if first delete button is pressed', () => {
        beforeEach(fakeAsync(() => {
          const deleteButton: DebugElement = fixture.debugElement.query(By.css('#epersonsSearch tbody .fa-trash-alt'));
          deleteButton.nativeElement.click();
          tick();
          fixture.detectChanges();
        }));
        it('then no ePerson is member of the active group', () => {
          epersonsFound = fixture.debugElement.queryAll(By.css('#epersonsSearch tbody tr'));
          expect(epersonsFound.length).toEqual(2);
          epersonsFound.map((foundEPersonRowElement: DebugElement) => {
            const addButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-plus'));
            const deleteButton: DebugElement = foundEPersonRowElement.query(By.css('td:last-child .fa-trash-alt'));
            expect(deleteButton).toBeNull();
            expect(addButton).not.toBeNull();
          });
        });
      });
    });
  });

});
