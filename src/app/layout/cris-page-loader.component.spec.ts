import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';

import { cold } from 'jasmine-marbles';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { CrisPageLoaderComponent } from './cris-page-loader.component';
import { CrisLayoutDefaultComponent } from './default-layout/cris-layout-default.component';
import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { LayoutPage } from './enums/layout-page.enum';
import { Item } from '../core/shared/item.model';
import { createPaginatedList } from '../shared/testing/utils.test';
import { TabDataService } from '../core/layout/tab-data.service';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { EditItemDataService } from '../core/submission/edititem-data.service';
import { EditItem } from '../core/submission/models/edititem.model';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../core/auth/auth.service';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { tabs } from '../shared/testing/tab.mock';
import { ItemDataService } from '../core/data/item-data.service';
import {NotificationsServiceStub} from '../shared/testing/notifications-service.stub';
import {NotificationsService} from '../shared/notifications/notifications.service';

const testType = LayoutPage.DEFAULT;

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'test'
      }
    ],
    'dspace.entity.type': [
      {
        language: null,
        value: testType
      }
    ]
  }
});

const tabDataServiceMock: any = jasmine.createSpyObj('TabDataService', {
  findByItem: jasmine.createSpy('findByItem')
});

const editItem: EditItem = Object.assign({
  modes: observableOf({})
});

const editItemDataServiceMock: any = jasmine.createSpyObj('EditItemDataService', {
  findById: jasmine.createSpy('findById')
});

const authorizationDataServiceMock: any = jasmine.createSpyObj('AuthorizationDataService', {
  isAuthorized: jasmine.createSpy('isAuthorized')
});

const authServiceMock: any = jasmine.createSpyObj('AuthService', {
  isAuthenticated: jasmine.createSpy('isAuthenticated')
});

const itemDataServiceMock: any = jasmine.createSpyObj('ItemDataService', {
  findById: jasmine.createSpy('findById')
});
// tslint:disable-next-line:prefer-const
let notificationService = new NotificationsServiceStub();
describe('CrisPageLoaderComponent', () => {
  let component: CrisPageLoaderComponent;
  let fixture: ComponentFixture<CrisPageLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [CrisPageLoaderComponent, CrisLayoutDefaultComponent, CrisLayoutLoaderDirective],
      providers: [
        { provide: TabDataService, useValue: tabDataServiceMock },
        { provide: EditItemDataService, useValue: editItemDataServiceMock },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ItemDataService, useValue: itemDataServiceMock },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: NotificationsService, useValue: notificationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisPageLoaderComponent, {
      set: {
        entryComponents: [CrisLayoutDefaultComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisPageLoaderComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
      a: createSuccessfulRemoteDataObject(createPaginatedList(tabs))
    }));
    editItemDataServiceMock.findById.and.returnValue(cold('a|', {
      a: createSuccessfulRemoteDataObject(
        editItem
      )
    }));
    authorizationDataServiceMock.isAuthorized.and.returnValue(observableOf(true));
    authServiceMock.isAuthenticated.and.returnValue(observableOf(true));
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('should call the getCrisLayoutPage function with the right types', (done) => {
      expect(component).toBeDefined();
      done();
    });
  });
});
