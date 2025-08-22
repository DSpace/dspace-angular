import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { ItemRequestDataService } from '@dspace/core/data/item-request-data.service';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Item } from '@dspace/core/shared/item.model';
import { ItemRequest } from '@dspace/core/shared/item-request.model';
import { RequestCopyEmail } from '@dspace/core/shared/request-copy-email.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { getMockThemeService } from '../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { VarDirective } from '../../shared/utils/var.directive';
import { DenyRequestCopyComponent } from './deny-request-copy.component';

describe('DenyRequestCopyComponent', () => {
  let component: DenyRequestCopyComponent;
  let fixture: ComponentFixture<DenyRequestCopyComponent>;

  let router: Router;
  let route: ActivatedRoute;
  let authService: AuthService;
  let translateService: TranslateService;
  let itemDataService: ItemDataService;
  let itemRequestService: ItemRequestDataService;
  let notificationsService: NotificationsService;

  let itemRequest: ItemRequest;
  let user: EPerson;
  let item: Item;
  let itemName: string;
  let itemUrl: string;

  beforeEach(waitForAsync(() => {
    itemRequest = Object.assign(new ItemRequest(), {
      token: 'item-request-token',
      requestName: 'requester name',
    });
    user = Object.assign(new EPerson(), {
      metadata: {
        'eperson.firstname': [
          {
            value: 'first',
          },
        ],
        'eperson.lastname': [
          {
            value: 'last',
          },
        ],
      },
      email: 'user-email',
    });
    itemName = 'item-name';
    itemUrl = 'item-url';
    item = Object.assign(new Item(), {
      id: 'item-id',
      metadata: {
        'dc.identifier.uri': [
          {
            value: itemUrl,
          },
        ],
        'dc.title': [
          {
            value: itemName,
          },
        ],
      },
    });

    router = jasmine.createSpyObj('router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    });
    route = jasmine.createSpyObj('route', {}, {
      data: of({
        request: createSuccessfulRemoteDataObject(itemRequest),
      }),
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
      getAuthenticatedUserFromStore: of(user),
    });
    itemDataService = jasmine.createSpyObj('itemDataService', {
      findById: createSuccessfulRemoteDataObject$(item),
    });
    itemRequestService = jasmine.createSpyObj('itemRequestService', {
      deny: createSuccessfulRemoteDataObject$(itemRequest),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['success', 'error']);

    return TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), DenyRequestCopyComponent, VarDirective],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: AuthService, useValue: authService },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: ItemRequestDataService, useValue: itemRequestService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenyRequestCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    translateService = (component as any).translateService;
    spyOn(translateService, 'get').and.returnValue(of('translated-message'));
  });

  it('message$ should be parameterized correctly', (done) => {
    component.message$.subscribe(() => {
      expect(translateService.get).toHaveBeenCalledWith(jasmine.anything(), Object.assign({
        recipientName: itemRequest.requestName,
        itemUrl: itemUrl,
        itemName: itemName,
        authorName: user.name,
        authorEmail: user.email,
      }));
      done();
    });
  });

  describe('deny', () => {
    let email: RequestCopyEmail;

    describe('when the request is successful', () => {
      beforeEach(() => {
        email = new RequestCopyEmail('subject', 'message');
        (itemRequestService.deny as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$(itemRequest));
        component.deny(email);
      });

      it('should display a success notification', () => {
        expect(notificationsService.success).toHaveBeenCalled();
      });

      it('should navigate to the homepage', () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      });
    });

    describe('when the request is unsuccessful', () => {
      beforeEach(() => {
        email = new RequestCopyEmail('subject', 'message');
        (itemRequestService.deny as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$());
        component.deny(email);
      });

      it('should display a success notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });

      it('should not navigate', () => {
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      });
    });
  });
});
