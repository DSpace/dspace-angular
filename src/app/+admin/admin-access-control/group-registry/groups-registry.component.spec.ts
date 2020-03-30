import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { Group } from '../../../core/eperson/models/group.model';
import { RouteService } from '../../../core/services/route.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import { MockRouter } from '../../../shared/mocks/mock-router';
import { MockTranslateLoader } from '../../../shared/mocks/mock-translate-loader';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { EPersonMock, EPersonMock2 } from '../../../shared/testing/eperson-mock';
import { GroupMock, GroupMock2 } from '../../../shared/testing/group-mock';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { routeServiceStub } from '../../../shared/testing/route-service-stub';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';
import { GroupsRegistryComponent } from './groups-registry.component';

describe('GroupRegistryComponent', () => {
  let component: GroupsRegistryComponent;
  let fixture: ComponentFixture<GroupsRegistryComponent>;
  let ePersonDataServiceStub: any;
  let groupsDataServiceStub: any;

  let mockGroups;
  let mockEPeople;

  beforeEach(async(() => {
    mockGroups = [GroupMock, GroupMock2];
    mockEPeople = [EPersonMock, EPersonMock2];
    ePersonDataServiceStub = {
      findAllByHref(href: string): Observable<RemoteData<PaginatedList<EPerson>>> {
        switch (href) {
          case 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/epersons':
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, []));
          case 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/epersons':
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, [EPersonMock]));
          default:
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, []));
        }
      }
    };
    groupsDataServiceStub = {
      allGroups: mockGroups,
      findAllByHref(href: string): Observable<RemoteData<PaginatedList<Group>>> {
        switch (href) {
          case 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/groups':
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, []));
          case 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/groups':
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, [GroupMock2]));
          default:
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, []));
        }
      },
      getGroupEditPageRouterLink(group: Group): string {
        return '/admin/access-control/groups/' + group.id;
      },
      getGroupRegistryRouterLink(): string {
        return '/admin/access-control/groups';
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(new PaginatedList(null, this.allGroups));
        }
        const result = this.allGroups.find((group: Group) => {
          return (group.id.includes(query))
        });
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [result]));
      }
    };
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      declarations: [GroupsRegistryComponent],
      providers: [GroupsRegistryComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: new MockRouter() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create GroupRegistryComponent', inject([GroupsRegistryComponent], (comp: GroupsRegistryComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should display list of groups', () => {
    const groupIdsFound = fixture.debugElement.queryAll(By.css('#groups tr td:first-child'));
    expect(groupIdsFound.length).toEqual(2);
    mockGroups.map((group: Group) => {
      expect(groupIdsFound.find((foundEl) => {
        return (foundEl.nativeElement.textContent.trim() === group.uuid);
      })).toBeTruthy();
    })
  });

  describe('search', () => {
    describe('when searching with query', () => {
      let groupIdsFound;
      beforeEach(fakeAsync(() => {
        component.search({ query: GroupMock2.id });
        tick();
        fixture.detectChanges();
        groupIdsFound = fixture.debugElement.queryAll(By.css('#groups tr td:first-child'));
      }));

      it('should display search result', () => {
        expect(groupIdsFound.length).toEqual(1);
        expect(groupIdsFound.find((foundEl) => {
          return (foundEl.nativeElement.textContent.trim() === GroupMock2.uuid);
        })).toBeTruthy();
      });
    });
  });
});
