import {
  ChangeDetectionStrategy,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { RequestService } from '../../../core/data/request.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { Item } from '../../../core/shared/item.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { getMockRequestService } from '../../mocks/request.service.mock';
import { getMockSearchService } from '../../mocks/search-service.mock';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { NotificationsService } from '../../notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../remote-data.utils';
import { ActivatedRouteStub } from '../../testing/active-router.stub';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { RouterStub } from '../../testing/router.stub';
import { WorkspaceitemActionsComponent } from './workspaceitem-actions.component';

let component: WorkspaceitemActionsComponent;
let fixture: ComponentFixture<WorkspaceitemActionsComponent>;

let mockObject: WorkspaceItem;
let notificationsServiceStub: NotificationsServiceStub;
let authorizationService;
let authService;

const mockDataService = jasmine.createSpyObj('WorkspaceitemDataService', {
  delete: jasmine.createSpy('delete'),
});

const searchService = getMockSearchService();

const requestServce = getMockRequestService();

const item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article',
      },
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
  },
});
const rd = createSuccessfulRemoteDataObject(item);
mockObject = Object.assign(new WorkspaceItem(), { item: observableOf(rd), id: '1234', uuid: '1234' });

const ePersonMock: EPerson = Object.assign(new EPerson(), {
  handle: null,
  netid: null,
  lastActive: '2023-04-27T12:15:57.054+00:00',
  canLogIn: true,
  email: 'dspacedemo+submit@gmail.com',
  requireCertificate: false,
  selfRegistered: false,
  _name: 'dspacedemo+submit@gmail.com',
  id: '914955b1-cf2e-4884-8af7-a166aa24cf73',
  uuid: '914955b1-cf2e-4884-8af7-a166aa24cf73',
  type: 'eperson',
  metadata: {
    'dspace.agreements.cookies': [
      {
        uuid: '0a53a0f2-e168-4ed9-b4af-cba9a2d267ca',
        language: null,
        value:
          '{"authentication":true,"preferences":true,"acknowledgement":true,"google-analytics":true}',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'dspace.agreements.end-user': [
      {
        uuid: '0879e571-6e4a-4efe-af9b-704c755166be',
        language: null,
        value: 'true',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'eperson.firstname': [
      {
        uuid: '18052a3e-f19b-49ca-b9f9-ee4cf9c71b86',
        language: null,
        value: 'Demo',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'eperson.language': [
      {
        uuid: '98c2abdb-6a6f-4b41-b455-896bcf333ca3',
        language: null,
        value: 'en',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
    'eperson.lastname': [
      {
        uuid: 'df722e70-9497-468d-a92a-4038e7ef2586',
        language: null,
        value: 'Submitter',
        place: 0,
        authority: null,
        confidence: -1,
      },
    ],
  },
  _links: {
    groups: {
      href: 'http://localhost:8080/server/api/eperson/epersons/914955b1-cf2e-4884-8af7-a166aa24cf73/groups',
    },
    self: {
      href: 'http://localhost:8080/server/api/eperson/epersons/914955b1-cf2e-4884-8af7-a166aa24cf73',
    },
  },
});

authService = jasmine.createSpyObj('authService', {
  getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
});

describe('WorkspaceitemActionsComponent', () => {
  beforeEach(waitForAsync(async () => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true),
    });
    await TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        WorkspaceitemActionsComponent,
      ],
      providers: [
        Injector,
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: WorkspaceitemDataService, useValue: mockDataService },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestServce },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        NgbModal,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(WorkspaceitemActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceitemActionsComponent);
    component = fixture.componentInstance;
    component.object = mockObject;
    notificationsServiceStub = TestBed.inject(NotificationsService as any);
    (authService.getAuthenticatedUserFromStore as jasmine.Spy).and.returnValue(observableOf(ePersonMock));
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should init object properly', () => {
    component.object = null;
    component.initObjects(mockObject);

    expect(component.object).toEqual(mockObject);
  });

  it('should display edit button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-primary'));

    expect(btn).not.toBeNull();
  });

  it('should display delete button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-danger'));

    expect(btn).not.toBeNull();
  });

  it('should display view button', () => {
    const btn = fixture.debugElement.query(By.css('button[data-test="view-btn"]'));

    expect(btn).not.toBeNull();
  });

  describe('on discard confirmation', () => {
    beforeEach((done) => {
      mockDataService.delete.and.returnValue(observableOf(true));
      spyOn(component, 'reload');
      const btn = fixture.debugElement.query(By.css('.btn-danger'));
      btn.nativeElement.click();
      fixture.detectChanges();

      const confirmBtn: any = ((document as any).querySelector('.modal-footer .btn-danger'));
      confirmBtn.click();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        done();
      });
    });

    it('should call confirmDiscard', () => {
      expect(mockDataService.delete).toHaveBeenCalledWith(mockObject.id);
    });
  });

  it('should display a success notification on delete success', waitForAsync(() => {
    spyOn((component as any).modalService, 'open').and.returnValue({ result: Promise.resolve('ok') });
    mockDataService.delete.and.returnValue(createSuccessfulRemoteDataObject$({}));
    spyOn(component, 'reload');

    component.confirmDiscard('ok');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  }));

  it('should display an error notification on delete failure', waitForAsync(() => {
    spyOn((component as any).modalService, 'open').and.returnValue({ result: Promise.resolve('ok') });
    mockDataService.delete.and.returnValue(createFailedRemoteDataObject$('Error', 500));
    spyOn(component, 'reload');

    component.confirmDiscard('ok');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  }));

  it('should clear the object cache by href', waitForAsync(() => {
    component.reload();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(searchService.getEndpoint).toHaveBeenCalled();
      expect(requestServce.removeByHrefSubstring).toHaveBeenCalledWith('discover/search/objects');
    });
  }));
});
