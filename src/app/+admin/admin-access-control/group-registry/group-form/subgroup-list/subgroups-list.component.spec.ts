import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../../../../../core/cache/response.models';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { RemoteData } from '../../../../../core/data/remote-data';
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { Group } from '../../../../../core/eperson/models/group.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { GroupMock, GroupMock2 } from '../../../../../shared/testing/group-mock';
import { of as observableOf } from 'rxjs';
import { SubgroupsListComponent } from './subgroups-list.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { RouterMock } from '../../../../../shared/mocks/router.mock';
import { getMockFormBuilderService } from '../../../../../shared/mocks/form-builder-service.mock';
import { getMockTranslateService } from '../../../../../shared/mocks/translate.service.mock';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { NotificationsServiceStub } from '../../../../../shared/testing/notifications-service.stub';

describe('SubgroupsListComponent', () => {
  let component: SubgroupsListComponent;
  let fixture: ComponentFixture<SubgroupsListComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let activeGroup;
  let subgroups;
  let allGroups;
  let routerStub;

  beforeEach(async(() => {
    activeGroup = GroupMock;
    subgroups = [GroupMock2];
    allGroups = [GroupMock, GroupMock2];
    ePersonDataServiceStub = {};
    groupsDataServiceStub = {
      activeGroup: activeGroup,
      subgroups: subgroups,
      getActiveGroup(): Observable<Group> {
        return observableOf(this.activeGroup);
      },
      getSubgroups(): Group {
        return this.activeGroup;
      },
      findAllByHref(href: string): Observable<RemoteData<PaginatedList<Group>>> {
        return createSuccessfulRemoteDataObject$(new PaginatedList<Group>(new PageInfo(), this.subgroups))
      },
      getGroupEditPageRouterLink(group: Group): string {
        return '/admin/access-control/groups/' + group.id;
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), allGroups))
        }
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
      },
      addSubGroupToGroup(parentGroup, subgroup: Group): Observable<RestResponse> {
        this.subgroups = [...this.subgroups, subgroup];
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      clearGroupsRequests() {
        // empty
      },
      clearGroupLinkRequests() {
        // empty
      },
      deleteSubGroupFromGroup(parentGroup, subgroup: Group): Observable<RestResponse> {
        this.subgroups = this.subgroups.find((group: Group) => {
          if (group.id !== subgroup.id) {
            return group;
          }
        });
        return observableOf(new RestResponse(true, 200, 'Success'));
      }
    };
    routerStub = new RouterMock();
    builderService = getMockFormBuilderService();
    translateService = getMockTranslateService();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [SubgroupsListComponent],
      providers: [SubgroupsListComponent,
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubgroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(fakeAsync(() => {
    fixture.destroy();
    flush();
    component = null;
  }));

  it('should create SubgroupsListComponent', inject([SubgroupsListComponent], (comp: SubgroupsListComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should show list of subgroups of current active group', () => {
    const groupIdsFound = fixture.debugElement.queryAll(By.css('#subgroupsOfGroup tr td:first-child'));
    expect(groupIdsFound.length).toEqual(1);
    activeGroup.subgroups.map((group: Group) => {
      expect(groupIdsFound.find((foundEl) => {
        return (foundEl.nativeElement.textContent.trim() === group.uuid);
      })).toBeTruthy();
    })
  });

  describe('if first group delete button is pressed', () => {
    let groupsFound;
    beforeEach(fakeAsync(() => {
      const addButton = fixture.debugElement.query(By.css('#subgroupsOfGroup tbody .deleteButton'));
      addButton.triggerEventHandler('click', {
        preventDefault: () => {/**/
        }
      });
      tick();
      fixture.detectChanges();
    }));
    it('one less subgroup in list from 1 to 0 (of 2 total groups)', () => {
      groupsFound = fixture.debugElement.queryAll(By.css('#subgroupsOfGroup tbody tr'));
      expect(groupsFound.length).toEqual(0);
    });
  });

  describe('search', () => {
    describe('when searching with empty query', () => {
      let groupsFound;
      beforeEach(fakeAsync(() => {
        component.search({ query: '' });
        groupsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr'));
      }));

      it('should display all groups', () => {
        fixture.detectChanges();
        groupsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr'));
        expect(groupsFound.length).toEqual(2);
        groupsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr'));
        const groupIdsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr td:first-child'));
        allGroups.map((group: Group) => {
          expect(groupIdsFound.find((foundEl) => {
            return (foundEl.nativeElement.textContent.trim() === group.uuid);
          })).toBeTruthy();
        })
      });

      describe('if group is already a subgroup', () => {
        it('should have delete button, else it should have add button', () => {
          fixture.detectChanges();
          groupsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr'));
          const getSubgroups = groupsDataServiceStub.getSubgroups().subgroups;
          if (getSubgroups !== undefined && getSubgroups.length > 0) {
            groupsFound.map((foundGroupRowElement) => {
              if (foundGroupRowElement.debugElement !== undefined) {
                const addButton = foundGroupRowElement.debugElement.query(By.css('td:last-child .fa-plus'));
                const deleteButton = foundGroupRowElement.debugElement.query(By.css('td:last-child .fa-trash-alt'));
                expect(addButton).toBeUndefined();
                expect(deleteButton).toBeDefined();
              }
            })
          } else {
            getSubgroups.map((group: Group) => {
              groupsFound.map((foundGroupRowElement) => {
                if (foundGroupRowElement.debugElement !== undefined) {
                  const groupId = foundGroupRowElement.debugElement.query(By.css('td:first-child'));
                  const addButton = foundGroupRowElement.debugElement.query(By.css('td:last-child .fa-plus'));
                  const deleteButton = foundGroupRowElement.debugElement.query(By.css('td:last-child .fa-trash-alt'));
                  if (groupId.nativeElement.textContent === group.id) {
                    expect(addButton).toBeUndefined();
                    expect(deleteButton).toBeDefined();
                  } else {
                    expect(deleteButton).toBeUndefined();
                    expect(addButton).toBeDefined();
                  }
                }
              })
            })
          }
        });
      });
    });
  });

});
