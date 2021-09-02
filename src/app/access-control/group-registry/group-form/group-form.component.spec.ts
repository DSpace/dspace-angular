import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { DSOChangeAnalyzer } from '../../../core/data/dso-change-analyzer.service';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { buildPaginatedList, PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Group } from '../../../core/eperson/models/group.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import { UUIDService } from '../../../core/shared/uuid.service';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { GroupMock, GroupMock2 } from '../../../shared/testing/group-mock';
import { GroupFormComponent } from './group-form.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { TranslateLoaderMock } from '../../../shared/testing/translate-loader.mock';
import { RouterMock } from '../../../shared/mocks/router.mock';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { Operation } from 'fast-json-patch';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let dsoDataServiceStub: any;
  let authorizationService: AuthorizationDataService;
  let notificationService: NotificationsServiceStub;
  let router;

  let groups;
  let groupName;
  let groupDescription;
  let expected;

  beforeEach(waitForAsync(() => {
    groups = [GroupMock, GroupMock2];
    groupName = 'testGroupName';
    groupDescription = 'testDescription';
    expected = Object.assign(new Group(), {
      name: groupName,
      metadata: {
        'dc.description': [
          {
            value: groupDescription
          }
        ],
      },
    });
    ePersonDataServiceStub = {};
    groupsDataServiceStub = {
      allGroups: groups,
      activeGroup: null,
      createdGroup: null,
      getActiveGroup(): Observable<Group> {
        return observableOf(this.activeGroup);
      },
      getGroupRegistryRouterLink(): string {
        return '/access-control/groups';
      },
      editGroup(group: Group) {
        this.activeGroup = group;
      },
      clearGroupsRequests() {
        return null;
      },
      patch(group: Group, operations: Operation[]) {
        return null;
      },
      cancelEditGroup(): void {
        this.activeGroup = null;
      },
      findById(id: string) {
        return observableOf({ payload: null, hasSucceeded: true });
      },
      findByHref(href: string) {
        return createSuccessfulRemoteDataObject$(this.createdGroup);
      },
      create(group: Group): Observable<RemoteData<Group>> {
        this.allGroups = [...this.allGroups, group];
        this.createdGroup = Object.assign({}, group, {
          _links: { self: { href: 'group-selflink' } }
        });
        return createSuccessfulRemoteDataObject$(this.createdGroup);
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
      },
      getGroupEditPageRouterLinkWithID(id: string) {
        return `group-edit-page-for-${id}`;
      }
    };
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    dsoDataServiceStub = {
      findByHref(href: string): Observable<RemoteData<DSpaceObject>> {
        return null;
      }
    };
    builderService = getMockFormBuilderService();
    translateService = getMockTranslateService();
    router = new RouterMock();
    notificationService = new NotificationsServiceStub();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [GroupFormComponent],
      providers: [GroupFormComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: DSpaceObjectDataService, useValue: dsoDataServiceStub },
        { provide: NotificationsService, useValue: notificationService },
        { provide: FormBuilderService, useValue: builderService },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { data: observableOf({ dso: { payload: {} } }), params: observableOf({}) }
        },
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: authorizationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when submitting the form', () => {
    beforeEach(() => {
      spyOn(component.submitForm, 'emit');
      component.groupName.value = groupName;
      component.groupDescription.value = groupDescription;
    });
    describe('without active Group', () => {
      beforeEach(() => {
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit a new group using the correct values', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
        });
      }));
    });
    describe('with active Group', () => {
      let expected2;
      beforeEach(() => {
        expected2 = Object.assign(new Group(), {
          name: 'newGroupName',
          metadata: {
            'dc.description': [
              {
                value: groupDescription
              }
            ],
          },
        });
        spyOn(groupsDataServiceStub, 'getActiveGroup').and.returnValue(observableOf(expected));
        spyOn(groupsDataServiceStub, 'patch').and.returnValue(createSuccessfulRemoteDataObject$(expected2));
        component.groupName.value = 'newGroupName';
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit the existing group using the correct new values', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(component.submitForm.emit).toHaveBeenCalledWith(expected2);
        });
      }));
      it('should emit success notification', () => {
        expect(notificationService.success).toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('does NOT call router.navigate', () => {
      component.ngOnDestroy();
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });

});
