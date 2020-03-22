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
import { GroupDataService } from '../../../../../core/eperson/group-data.service';
import { Group } from '../../../../../core/eperson/models/group.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../../../../shared/mocks/mock-form-builder-service';
import { getMockTranslateService } from '../../../../../shared/mocks/mock-translate.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { GroupMock, GroupMock2 } from '../../../../../shared/testing/group-mock';
import { MockTranslateLoader } from '../../../../../shared/testing/mock-translate-loader';
import { NotificationsServiceStub } from '../../../../../shared/testing/notifications-service-stub';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/testing/utils';
import { SubgroupsListComponent } from './subgroups-list.component';

describe('SubgroupsListComponent', () => {
  let component: SubgroupsListComponent;
  let fixture: ComponentFixture<SubgroupsListComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let activeGroup;
  let allGroups;

  beforeEach(async(() => {
    activeGroup = GroupMock;
    allGroups = [GroupMock, GroupMock2]
    ePersonDataServiceStub = {};
    groupsDataServiceStub = {
      activeGroup: activeGroup,
      getActiveGroup(): Observable<Group> {
        return observableOf(this.activeGroup);
      },
      findAllByHref(href: string): Observable<RemoteData<PaginatedList<Group>>> {
        return createSuccessfulRemoteDataObject$(new PaginatedList<Group>(new PageInfo(), this.activeGroup.subgroups))
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
        this.activeGroup.subgroups = [...this.activeGroup.subgroups, subgroup];
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      clearGroupsRequests() {
        // empty
      },
      deleteSubGroupFromGroup(parentGroup, subgroup: Group): Observable<RestResponse>  {
        this.activeGroup.subgroups = this.activeGroup.subgroups.find((group: Group) => {
          if (group.id !== subgroup.id) {
            return group;
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
      declarations: [SubgroupsListComponent],
      providers: [SubgroupsListComponent,
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubgroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SubgroupsListComponent', inject([SubgroupsListComponent], (comp: SubgroupsListComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should show list of subgroups of current active group', () => {
    const groupIdsFound = fixture.debugElement.queryAll(By.css('#groups tr td:first-child'));
    expect(groupIdsFound.length).toEqual(1);
    activeGroup.subgroups.map((group: Group) => {
      expect(groupIdsFound.find((foundEl) => {
        return (foundEl.nativeElement.textContent.trim() === group.uuid);
      })).toBeTruthy();
    })
  });

  describe('search', () => {
    describe('when searching without query', () => {
      let groupsFound;
      beforeEach(fakeAsync(() => {
        component.search({ query: '' });
        tick();
        fixture.detectChanges();
        groupsFound = fixture.debugElement.queryAll(By.css('#groups tbody tr'));
      }));

      it('should display all groups', () => {
        expect(groupsFound.length).toEqual(2);
      });

      describe('if group is already a subgroup', () => {
        it('should have delete button, else it should have add button', () => {
          activeGroup.subgroups.map((group: Group) => {
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
        });
      });

      describe('if first add button is pressed', () => {
        beforeEach(fakeAsync(() => {
          const addButton = fixture.debugElement.query(By.css('#groups tbody .fa-plus'));
          addButton.nativeElement.click();
          tick();
          fixture.detectChanges();
        }));
        it('one more subgroup in list (from 1 to 2 total groups)', () => {
          groupsFound = fixture.debugElement.queryAll(By.css('#groups tbody tr'));
          expect(groupsFound.length).toEqual(2);
        });
      });

      describe('if first delete button is pressed', () => {
        beforeEach(fakeAsync(() => {
          const addButton = fixture.debugElement.query(By.css('#groups tbody .fa-trash-alt'));
          addButton.nativeElement.click();
          tick();
          fixture.detectChanges();
        }));
        it('one less subgroup in list from 1 to 0 (of 2 total groups)', () => {
          groupsFound = fixture.debugElement.queryAll(By.css('#groups tbody tr'));
          expect(groupsFound.length).toEqual(0);
        });
      });
    });
  });

});
