import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestScheduler } from 'rxjs/testing';

import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CrisLayoutDefaultComponent } from './cris-layout-default.component';
import { LayoutPage } from '../enums/layout-page.enum';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { tabDetailsTest, tabPublicationsTest, tabs } from '../../shared/testing/new-tab.mock';
import { TabDataService } from '../../core/layout/tab-data.service';
import { CrisLayoutDefaultTabComponent } from './tab/cris-layout-default-tab.component';
import { Item } from '../../core/shared/item.model';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { EditItemDataService } from '../../core/submission/edititem-data.service';
import { EditItem } from '../../core/submission/models/edititem.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { BoxDataService } from '../../core/layout/box-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { boxMetadata } from '../../shared/testing/box.mock';
import { tabPersonProfile } from '../../shared/testing/tab.mock';

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

const boxDataServiceMock: any = jasmine.createSpyObj('BoxDataService', {
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

describe('CrisLayoutDefaultComponent', () => {
  let component: CrisLayoutDefaultComponent;
  let fixture: ComponentFixture<CrisLayoutDefaultComponent>;
  let scheduler: TestScheduler;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [CrisLayoutDefaultComponent, CrisLayoutDefaultTabComponent, CrisLayoutLoaderDirective],
      providers: [
        { provide: BoxDataService, useValue: boxDataServiceMock },
        { provide: TabDataService, useValue: tabDataServiceMock },
        { provide: EditItemDataService, useValue: editItemDataServiceMock },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceMock },
        { provide: ItemDataService, useValue: itemDataServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        // { provide: ComponentFactoryResolver, useValue: mockComponentFactoryResolver },
        ChangeDetectorRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisLayoutDefaultComponent, {
      set: {
        entryComponents: [CrisLayoutDefaultTabComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(CrisLayoutDefaultComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    // spyOnExported(CrisLayoutTabDecorators, 'getCrisLayoutTab').and.returnValue(CrisLayoutDefaultTabComponent);
    editItemDataServiceMock.findById.and.returnValue(cold('a|', {
      a: createSuccessfulRemoteDataObject(
        editItem
      )
    }));
    boxDataServiceMock.findByItem.and.returnValue(cold('a|', {
      a: createSuccessfulRemoteDataObject(createPaginatedList([boxMetadata]))
    }));
    authorizationDataServiceMock.isAuthorized.and.returnValue(observableOf(true));
    authServiceMock.isAuthenticated.and.returnValue(observableOf(true));
  });

  afterEach(() => {
    scheduler = null;
    component = null;
  });

  describe('When the component is rendered with more then one tab', () => {
    beforeEach(() => {
      tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList(tabs))
      }));
    });

    it('should init component properly', (done) => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();

      expect(component.getTabs()).toBeObservable(hot('(a|)', {
        a: tabs
      }));

      expect(component.hasSidebar()).toBeObservable(hot('(a|)', {
        a: true
      }));

      done();
    });

    it('should call the getCrisLayoutPage function with the right types', (done) => {
      spyOn((component as any), 'getComponent').and.returnValue(CrisLayoutDefaultTabComponent);
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      component.changeTab(tabPublicationsTest);
      expect((component as any).getComponent).toHaveBeenCalledWith(tabPublicationsTest.shortname);

      done();
    });

    it('check sidebar hide/show function', (done) => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      expect((component as any).sidebarStatus$.value).toBeTrue();
      component.toggleSidebar();
      expect((component as any).sidebarStatus$.value).toBeFalse();
      component.toggleSidebar();

      done();
    });

    it('check if sidebar and its control are showed', (done) => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      const sidebarControl$ = component.isSideBarHidden();
      expect(sidebarControl$).toBeObservable(hot('a', {
        a: false
      }));

      done();
    });
  });

  describe('When the component is rendered with only one tab', () => {

    beforeEach(() => {
      tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList([tabDetailsTest]))
      }));
    });

    it('check if sidebar and its control are hidden', (done) => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      const sidebarControl$ = component.isSideBarHidden();
      expect(sidebarControl$).toBeObservable(hot('a', {
        a: true
      }));

      expect(component.hasSidebar()).toBeObservable(hot('(a|)', {
        a: false
      }));

      done();
    });
  });

  describe('When a tab emit a refresh', () => {

    beforeEach(() => {
      tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList([tabPersonProfile]))
      }));
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();

      scheduler.schedule(() => component.changeTab(tabPersonProfile));
      scheduler.flush();
    });

    it('should call the refreshTab method', (done) => {

      spyOn(component, 'refreshTab');

      scheduler.schedule(() => (component.componentRef.instance as any).refreshTab.emit());
      scheduler.flush();

      expect(component.refreshTab).toHaveBeenCalled();

      done();
    });
  });

  describe('When the refreshTab method is called', () => {

    beforeEach(() => {
      const updatedMockItem = Object.assign(new Item(), {
        ...mockItem,
        lastModified: '2019',
      });

      tabDataServiceMock.findByItem.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(createPaginatedList([tabPersonProfile]))
      }));
      itemDataServiceMock.findById.and.returnValue(cold('a|', {
        a: createSuccessfulRemoteDataObject(updatedMockItem)
      }));
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();

      scheduler.schedule(() => component.changeTab(tabPersonProfile));
      scheduler.flush();
    });


    it('should destroy the previous tab, refresh the item and initialize the component', (done) => {

      spyOn(component, 'destroyTab').and.callThrough();
      spyOn(component, 'refreshItem').and.callThrough();
      spyOn(component, 'initializeComponent').and.returnValue();
      scheduler.schedule(() => component.refreshTab());
      scheduler.flush();

      expect(component.destroyTab).toHaveBeenCalled();
      expect(component.refreshItem).toHaveBeenCalled();
      expect(component.initializeComponent).toHaveBeenCalled();

      expect(component.item.lastModified).toEqual('2019' as any);

      done();
    });

  });
});
