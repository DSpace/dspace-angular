import {
  CommonModule,
  Location,
} from '@angular/common';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_DATA_SERVICES_MAP } from '../../../../config/app-config.interface';
import { AuthService } from '../../../core/auth/auth.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RestResponse } from '../../../core/cache/response.models';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ItemRequestDataService } from '../../../core/data/item-request-data.service';
import { RequestService } from '../../../core/data/request.service';
import { RequestEntry } from '../../../core/data/request-entry.model';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { ItemRequest } from '../../../core/shared/item-request.model';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { BitstreamRequestACopyPageComponent } from './bitstream-request-a-copy-page.component';

const mockDataServiceMap: any = new Map([
  [ITEM.value, () => import('../../../shared/testing/test-data-service.mock').then(m => m.TestDataService)],
]);

describe('BitstreamRequestACopyPageComponent', () => {
  let component: BitstreamRequestACopyPageComponent;
  let fixture: ComponentFixture<BitstreamRequestACopyPageComponent>;

  let authService: AuthService;
  let authorizationService: AuthorizationDataService;
  let activatedRoute;
  let router;
  let itemRequestDataService: ItemRequestDataService;
  let notificationsService;
  let location;
  let bitstreamDataService;
  let requestService;

  let item: Item;
  let bitstream: Bitstream;
  let eperson;

  function init() {
    eperson = Object.assign(new EPerson(), {
      email: 'test@mail.org',
      metadata: {
        'eperson.firstname': [{ value: 'Test' }],
        'eperson.lastname': [{ value: 'User' }],
      },
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(false),
      getAuthenticatedUserFromStore: of(eperson),
    });
    authorizationService = jasmine.createSpyObj('authorizationSerivice', {
      isAuthorized: of(true),
    });

    itemRequestDataService = jasmine.createSpyObj('itemRequestDataService', {
      requestACopy: createSuccessfulRemoteDataObject$({}),
      isProtectedByCaptcha: of(true),
    });

    requestService = Object.assign(getMockRequestService(), {
      getByHref(requestHref: string) {
        const responseCacheEntry = new RequestEntry();
        responseCacheEntry.response = new RestResponse(true, 200, 'OK');
        return of(responseCacheEntry);
      },
      removeByHrefSubstring(href: string) {
        // Do nothing
      },
    }) as RequestService;

    location = jasmine.createSpyObj('location', {
      back: {},
    });

    notificationsService = new NotificationsServiceStub();

    item = Object.assign(new Item(), { uuid: 'item-uuid' });

    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        content: { href: 'bitstream-content-link' },
        self: { href: 'bitstream-self-link' },
      },
    });

    activatedRoute = {
      data: of({
        dso: createSuccessfulRemoteDataObject(
          item,
        ),
      }),
      queryParams: of({
        bitstream : bitstream.uuid,
      }),
    };

    bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
      findById: createSuccessfulRemoteDataObject$(bitstream),
    });

    router = new RouterStub();
  }

  function initTestbed() {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, BitstreamRequestACopyPageComponent],
      providers: [
        { provide: Location, useValue: location },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: AuthService, useValue: authService },
        { provide: ItemRequestDataService, useValue: itemRequestDataService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: Store, useValue: provideMockStore() },
        { provide: RequestService, useValue: requestService },
        { provide: APP_DATA_SERVICES_MAP, useValue: mockDataServiceMap },
      ],
    })
      .compileComponents();
  }

  describe('init', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should init the comp', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('should show a form to request a copy', () => {
    describe('when the user is not logged in', () => {
      beforeEach(waitForAsync(() => {
        init();
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('show the form with no values filled in based on the user', () => {
        expect(component.name.value).toEqual('');
        expect(component.email.value).toEqual('');
        expect(component.allfiles.value).toEqual('false');
        expect(component.message.value).toEqual('');
      });
    });

    describe('when the user is logged in', () => {
      beforeEach(waitForAsync(() => {
        init();
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(of(true));
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('show the form with values filled in based on the user', () => {
        fixture.detectChanges();
        expect(component.name.value).toEqual(eperson.name);
        expect(component.email.value).toEqual(eperson.email);
        expect(component.allfiles.value).toEqual('false');
        expect(component.message.value).toEqual('');
      });
    });
    describe('when no bitstream was provided', () => {
      beforeEach(waitForAsync(() => {
        init();
        activatedRoute = {
          data: of({
            dso: createSuccessfulRemoteDataObject(
              item,
            ),
          }),
          queryParams: of({
          }),
        };
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should set the all files value to true and disable the false value', () => {
        expect(component.name.value).toEqual('');
        expect(component.email.value).toEqual('');
        expect(component.allfiles.value).toEqual('true');
        expect(component.message.value).toEqual('');

        const allFilesFalse = fixture.debugElement.query(By.css('#allfiles-false')).nativeElement;
        expect(allFilesFalse.getAttribute('disabled')).toBeTruthy();

      });
    });
    describe('when the user has authorization to download the file', () => {
      beforeEach(waitForAsync(() => {
        init();
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(of(true));
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should show an alert indicating the user can download the file', () => {
        const alert = fixture.debugElement.query(By.css('.alert')).nativeElement;
        expect(alert.innerHTML).toContain('bitstream-request-a-copy.alert.canDownload');
      });
    });
  });

  describe('onSubmit', () => {
    describe('onSuccess', () => {
      beforeEach(waitForAsync(() => {
        init();
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should take the current form information and submit it', () => {
        component.name.patchValue('User Name');
        component.email.patchValue('user@name.org');
        component.allfiles.patchValue('false');
        component.message.patchValue('I would like to request a copy');
        component.captchaPayload.patchValue('payload');

        component.onSubmit();
        const itemRequest = Object.assign(new ItemRequest(),
          {
            itemId: item.uuid,
            bitstreamId: bitstream.uuid,
            allfiles: 'false',
            requestEmail: 'user@name.org',
            requestName: 'User Name',
            requestMessage: 'I would like to request a copy',
          });

        expect(itemRequestDataService.requestACopy).toHaveBeenCalledWith(itemRequest, 'payload');
        expect(notificationsService.success).toHaveBeenCalled();
        expect(location.back).toHaveBeenCalled();
      });
    });

    describe('onFail', () => {
      beforeEach(waitForAsync(() => {
        init();
        (itemRequestDataService.requestACopy as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$());
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamRequestACopyPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should take the current form information and submit it', () => {
        component.name.patchValue('User Name');
        component.email.patchValue('user@name.org');
        component.allfiles.patchValue('false');
        component.message.patchValue('I would like to request a copy');
        component.captchaPayload.patchValue('payload');

        component.onSubmit();
        const itemRequest = Object.assign(new ItemRequest(),
          {
            itemId: item.uuid,
            bitstreamId: bitstream.uuid,
            allfiles: 'false',
            requestEmail: 'user@name.org',
            requestName: 'User Name',
            requestMessage: 'I would like to request a copy',
          });

        expect(itemRequestDataService.requestACopy).toHaveBeenCalledWith(itemRequest, 'payload');
        expect(notificationsService.error).toHaveBeenCalled();
        expect(location.back).not.toHaveBeenCalled();
      });
    });
  });
});
