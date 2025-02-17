import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { RestResponse } from '../../../../core/cache/response.models';
import { buildPaginatedList, PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { GroupMock, GroupMock2 } from '../../../../shared/testing/group-mock';
import { SubgroupsListComponent } from './subgroups-list.component';
import {
  createSuccessfulRemoteDataObject$
} from '../../../../shared/remote-data.utils';
import { RouterMock } from '../../../../shared/mocks/router.mock';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { getMockTranslateService } from '../../../../shared/mocks/translate.service.mock';
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { EPersonMock2 } from 'src/app/shared/testing/eperson.mock';

describe('SubgroupsListComponent', () => {
  let component: SubgroupsListComponent;
  let fixture: ComponentFixture<SubgroupsListComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let activeGroup: Group;
  let subgroups: Group[];
  let groupNonMembers: Group[];
  let routerStub;
  let paginationService;
  // Define a new mock activegroup for all tests below
  let mockActiveGroup: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [GroupMock2],
    epersons: [EPersonMock2],
    selfRegistered: false,
    permanent: false,
    _links: {
        self: {
            href: 'https://rest.api/server/api/eperson/groups/activegroupid',
        },
        subgroups: { href: 'https://rest.api/server/api/eperson/groups/activegroupid/subgroups' },
        object: { href: 'https://rest.api/server/api/eperson/groups/activegroupid/object' },
        epersons: { href: 'https://rest.api/server/api/eperson/groups/activegroupid/epersons' }
    },
    _name: 'activegroupname',
    id: 'activegroupid',
    uuid: 'activegroupid',
    type: 'group',
  });

  beforeEach(waitForAsync(() => {
    activeGroup = mockActiveGroup;
    subgroups = [GroupMock2];
    groupNonMembers = [GroupMock];
    ePersonDataServiceStub = {};
    groupsDataServiceStub = {
      activeGroup: activeGroup,
      subgroups: subgroups,
      groupNonMembers: groupNonMembers,
      getActiveGroup(): Observable<Group> {
        return observableOf(this.activeGroup);
      },
      getSubgroups(): Group {
        return this.subgroups;
      },
      // This method is used to get all the current subgroups
      findListByHref(_href: string): Observable<RemoteData<PaginatedList<Group>>> {
        return createSuccessfulRemoteDataObject$(buildPaginatedList<Group>(new PageInfo(), groupsDataServiceStub.getSubgroups()));
      },
      getGroupEditPageRouterLink(group: Group): string {
        return '/access-control/groups/' + group.id;
      },
      // This method is used to get all groups which are NOT currently a subgroup member
      searchNonMemberGroups(query: string, group: string): Observable<RemoteData<PaginatedList<Group>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), groupNonMembers));
        }
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
      },
      addSubGroupToGroup(parentGroup, subgroupToAdd: Group): Observable<RestResponse> {
        // Add group to list of subgroups
        this.subgroups = [...this.subgroups, subgroupToAdd];
        // Remove group from list of non-members
        this.groupNonMembers.forEach( (group: Group, index: number) => {
          if (group.id === subgroupToAdd.id) {
            this.groupNonMembers.splice(index, 1);
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
      deleteSubGroupFromGroup(parentGroup, subgroupToDelete: Group): Observable<RestResponse> {
        // Remove group from list of subgroups
        this.subgroups.forEach( (group: Group, index: number) => {
          if (group.id === subgroupToDelete.id) {
            this.subgroups.splice(index, 1);
          }
        });
        // Add group to list of non-members
        this.groupNonMembers = [...this.groupNonMembers, subgroupToDelete];
        return observableOf(new RestResponse(true, 200, 'Success'));
      }
    };
    routerStub = new RouterMock();
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
      declarations: [SubgroupsListComponent],
      providers: [SubgroupsListComponent,
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        { provide: Router, useValue: routerStub },
        { provide: PaginationService, useValue: paginationService },
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
    fixture.debugElement.nativeElement.remove();
    flush();
    component = null;
  }));

  it('should create SubgroupsListComponent', inject([SubgroupsListComponent], (comp: SubgroupsListComponent) => {
    expect(comp).toBeDefined();
  }));

  describe('current subgroup list', () => {
    it('should show list of subgroups of current active group', () => {
      const groupIdsFound = fixture.debugElement.queryAll(By.css('#subgroupsOfGroup tr td:first-child'));
      expect(groupIdsFound.length).toEqual(1);
      subgroups.map((group: Group) => {
        expect(groupIdsFound.find((foundEl) => {
          return (foundEl.nativeElement.textContent.trim() === group.uuid);
        })).toBeTruthy();
      });
    });

    it('should show a delete button next to each subgroup', () => {
      const subgroupsFound = fixture.debugElement.queryAll(By.css('#subgroupsOfGroup tbody tr'));
      subgroupsFound.map((foundGroupRowElement: DebugElement) => {
        const addButton: DebugElement = foundGroupRowElement.query(By.css('td:last-child .fa-plus'));
        const deleteButton: DebugElement = foundGroupRowElement.query(By.css('td:last-child .fa-trash-alt'));
        expect(addButton).toBeNull();
        expect(deleteButton).not.toBeNull();
      });
    });

    describe('if first group delete button is pressed', () => {
      let groupsFound: DebugElement[];
      beforeEach(() => {
        const deleteButton = fixture.debugElement.query(By.css('#subgroupsOfGroup tbody .deleteButton'));
        deleteButton.nativeElement.click();
        fixture.detectChanges();
      });
      it('then no subgroup remains as a member of the active group', () => {
        groupsFound = fixture.debugElement.queryAll(By.css('#subgroupsOfGroup tbody tr'));
        expect(groupsFound.length).toEqual(0);
      });
    });
  });

  describe('search', () => {
    describe('when searching with empty query', () => {
      let groupsFound: DebugElement[];
      beforeEach(fakeAsync(() => {
        component.search({ query: '' });
        fixture.detectChanges();
        groupsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr'));
      }));

      it('should display only non-member groups (i.e. groups that are not a subgroup)', () => {
        const groupIdsFound: DebugElement[] = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr td:first-child'));
        expect(groupIdsFound.length).toEqual(1);
        groupNonMembers.map((group: Group) => {
          expect(groupIdsFound.find((foundEl: DebugElement) => {
            return (foundEl.nativeElement.textContent.trim() === group.uuid);
          })).toBeTruthy();
        });
      });

      it('should display an add button next to non-member groups, not a delete button', () => {
        groupsFound.map((foundGroupRowElement: DebugElement) => {
          const addButton: DebugElement = foundGroupRowElement.query(By.css('td:last-child .fa-plus'));
          const deleteButton: DebugElement = foundGroupRowElement.query(By.css('td:last-child .fa-trash-alt'));
          expect(addButton).not.toBeNull();
          expect(deleteButton).toBeNull();
        });
      });

      describe('if first add button is pressed', () => {
        beforeEach(() => {
          const addButton: DebugElement = fixture.debugElement.query(By.css('#groupsSearch tbody .fa-plus'));
          addButton.nativeElement.click();
          fixture.detectChanges();
        });
        it('then all (two) Groups are subgroups of the active group. No non-members left', () => {
          groupsFound = fixture.debugElement.queryAll(By.css('#groupsSearch tbody tr'));
          expect(groupsFound.length).toEqual(0);
        });
      });
    });
  });

});
