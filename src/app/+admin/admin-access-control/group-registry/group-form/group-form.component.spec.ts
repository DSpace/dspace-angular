import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { RestResponse } from '../../../../core/cache/response.models';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { Group } from '../../../../core/eperson/models/group.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { GroupMock, GroupMock2 } from '../../../../shared/testing/group-mock';
import { GroupFormComponent } from './group-form.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { getMockTranslateService } from '../../../../shared/mocks/translate.service.mock';
import { TranslateLoaderMock } from '../../../../shared/testing/translate-loader.mock';
import { RouterMock } from '../../../../shared/mocks/router.mock';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;
  let router;

  let groups;
  let groupName;
  let groupDescription;
  let expected;

  beforeEach(async(() => {
    groups = [GroupMock, GroupMock2]
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
      getActiveGroup(): Observable<Group> {
        return observableOf(this.activeGroup);
      },
      getGroupRegistryRouterLink(): string {
        return '/admin/access-control/groups';
      },
      editGroup(group: Group) {
        this.activeGroup = group
      },
      cancelEditGroup(): void {
        this.activeGroup = null;
      },
      findById(id: string) {
        return observableOf({ payload: null, hasSucceeded: true });
      },
      tryToCreate(group: Group): Observable<RestResponse> {
        this.allGroups = [...this.allGroups, group]
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
      }
    };
    builderService = getMockFormBuilderService();
    translateService = getMockTranslateService();
    router = new RouterMock();
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
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: observableOf({ dso: { payload: {} } }), params: observableOf({}) } },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create GroupFormComponent', inject([GroupFormComponent], (comp: GroupFormComponent) => {
    expect(comp).toBeDefined();
  }));

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

      it('should emit a new group using the correct values', async(() => {
        fixture.whenStable().then(() => {
          expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
        });
      }));
    });
  });

});
