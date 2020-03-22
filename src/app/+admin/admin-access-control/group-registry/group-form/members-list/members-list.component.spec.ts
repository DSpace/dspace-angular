import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../../../../../core/cache/response.models';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { RemoteData } from '../../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { EPerson } from '../../../../../core/eperson/models/eperson.model';
import { Group } from '../../../../../core/eperson/models/group.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../../../../shared/mocks/mock-form-builder-service';
import { getMockTranslateService } from '../../../../../shared/mocks/mock-translate.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { EPersonMock, EPersonMock2 } from '../../../../../shared/testing/eperson-mock';
import { GroupMock, GroupMock2 } from '../../../../../shared/testing/group-mock';
import { MockTranslateLoader } from '../../../../../shared/testing/mock-translate-loader';
import { NotificationsServiceStub } from '../../../../../shared/testing/notifications-service-stub';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/testing/utils';
import { MembersListComponent } from './members-list.component';

describe('MembersListComponent', () => {
  let component: MembersListComponent;
  let fixture: ComponentFixture<MembersListComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let activeGroup;
  let allEPersons;
  let allGroups;

  beforeEach(async(() => {
    activeGroup = GroupMock;
    activeGroup.epersons = [EPersonMock2];
    allEPersons = [EPersonMock, EPersonMock2];
    allGroups = [GroupMock, GroupMock2]
    ePersonDataServiceStub = {
      findAllByHref(href: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        return createSuccessfulRemoteDataObject$(new PaginatedList<EPerson>(new PageInfo(), activeGroup.epersons))
      },
      searchByScope(scope: string, query: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), allEPersons))
        }
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
      },
      clearEPersonRequests() {
        // empty
      },
      getEPeoplePageRouterLink(): string {
        return '/admin/access-control/epeople';
      }
    };
    groupsDataServiceStub = {
      getActiveGroup(): Observable<Group> {
        return observableOf(activeGroup);
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), allGroups))
        }
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
      },
      addMemberToGroup(parentGroup, eperson: EPerson): Observable<RestResponse> {
        activeGroup.epersons = [...activeGroup.epersons, eperson];
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      clearGroupsRequests() {
        // empty
      },
      deleteMemberFromGroup(parentGroup, epersonToDelete: EPerson): Observable<RestResponse> {
        activeGroup.epersons = activeGroup.epersons.find((eperson: EPerson) => {
          if (eperson.id !== epersonToDelete.id) {
            return eperson;
          }
        });
        return observableOf(new RestResponse(true, 200, 'Success'));
      }
    };
    builderService = getMockFormBuilderService();
    translateService = getMockTranslateService();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      declarations: [MembersListComponent],
      providers: [MembersListComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create MembersListComponent', inject([MembersListComponent], (comp: MembersListComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should show list of eperson members of current active group', () => {
    const epersonIdsFound = fixture.debugElement.queryAll(By.css('#epersons tr td:first-child'));
    expect(epersonIdsFound.length).toEqual(1);
    activeGroup.epersons.map((eperson: EPerson) => {
      expect(epersonIdsFound.find((foundEl) => {
        return (foundEl.nativeElement.textContent.trim() === eperson.uuid);
      })).toBeTruthy();
    });
  });

  describe('search', () => {
    describe('when searching without query', () => {
      let epersonsFound;
      beforeEach(fakeAsync(() => {
        component.search({ scope: 'metadata', query: '' });
        tick();
        fixture.detectChanges();
        epersonsFound = fixture.debugElement.queryAll(By.css('#epersons tbody tr'));
      }));

      it('should display all epersons', () => {
        expect(epersonsFound.length).toEqual(2);
      });

      describe('if eperson is already a subeperson', () => {
        it('should have delete button, else it should have add button', () => {
          activeGroup.epersons.map((eperson: EPerson) => {
            epersonsFound.map((foundEPersonRowElement) => {
              if (foundEPersonRowElement.debugElement !== undefined) {
                const epersonId = foundEPersonRowElement.debugElement.query(By.css('td:first-child'));
                const addButton = foundEPersonRowElement.debugElement.query(By.css('td:last-child .fa-plus'));
                const deleteButton = foundEPersonRowElement.debugElement.query(By.css('td:last-child .fa-trash-alt'));
                if (epersonId.nativeElement.textContent === eperson.id) {
                  expect(addButton).toBeUndefined();
                  expect(deleteButton).toBeDefined();
                } else {
                  expect(deleteButton).toBeUndefined();
                  expect(addButton).toBeDefined();
                }
              }
            })
          })
        });
      });

      describe('if first add button is pressed', () => {
        beforeEach(fakeAsync(() => {
          const addButton = fixture.debugElement.query(By.css('#epersons tbody .fa-plus'));
          addButton.nativeElement.click();
          tick();
          fixture.detectChanges();
        }));
        it('one more subeperson in list (from 1 to 2 total epersons)', () => {
          epersonsFound = fixture.debugElement.queryAll(By.css('#epersons tbody tr'));
          expect(epersonsFound.length).toEqual(2);
        });
      });

      describe('if first delete button is pressed', () => {
        beforeEach(fakeAsync(() => {
          const addButton = fixture.debugElement.query(By.css('#epersons tbody .fa-trash-alt'));
          addButton.nativeElement.click();
          tick();
          fixture.detectChanges();
        }));
        it('one less subeperson in list from 1 to 0 (of 2 total epersons)', () => {
          epersonsFound = fixture.debugElement.queryAll(By.css('#epersons tbody tr'));
          expect(epersonsFound.length).toEqual(0);
        });
      });
    });
  });

});
