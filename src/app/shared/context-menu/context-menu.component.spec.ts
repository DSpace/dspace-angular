import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Injector, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { AppState } from '../../app.reducer';
import { ContextMenuComponent } from './context-menu.component';
import { rendersContextMenuEntriesForType } from './context-menu.decorator';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ExportItemMenuComponent } from './export-item/export-item-menu.component';
import { StatisticsMenuComponent } from './statistics/statistics-menu.component';
import { SubscriptionMenuComponent } from './subscription/subscription-menu.component';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsServiceStub } from '../testing/notifications-service.stub';
import { AuthService } from '../../core/auth/auth.service';
import { EPersonMock } from '../testing/eperson.mock';
import { ItemExportFormConfiguration, ItemExportService } from '../search/item-export/item-export.service';
import { BrowserOnlyDirective } from '../utils/browser-only.directive';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;
  let store: MockStore<AppState>;
  let initialState;
  let dso: DSpaceObject;
  let configuration: ItemExportFormConfiguration;
  const itemExportService: any = jasmine.createSpyObj('ItemExportFormatService', {
    initialItemExportFormConfiguration: jasmine.createSpy('initialItemExportFormConfiguration'),
    onSelectEntityType: jasmine.createSpy('onSelectEntityType'),
    submitForm: jasmine.createSpy('submitForm')
  });
  const authState: any = {
    core: {
      auth: {
        authenticated: true,
        loaded: true,
        loading: false,
        authMethods: []
      }
    }
  };

  const notAuthState: any = {
    core: {
      auth: {
        authenticated: false,
        loaded: true,
        loading: false,
        authMethods: []
      }
    }
  };

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: jasmine.createSpy('findByPropertyName')
  });
  const authorizationDataService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: of(true),
  });
  const authService = jasmine.createSpyObj('authService', {
    isAuthenticated: of(true),
    getAuthenticatedUserFromStore: of(EPersonMock),
  });

  const confResponse$ = createSuccessfulRemoteDataObject$({ values: ['true'] });
  const confResponseDisabled$ = createSuccessfulRemoteDataObject$({ values: ['false'] });

  function init() {
    initialState = authState;
    itemExportService.initialItemExportFormConfiguration.and.returnValue(of(configuration));

    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NgbDropdownModule,
        BrowserOnlyDirective
      ],
      declarations: [ContextMenuComponent, TestComponent, ExportItemMenuComponent, StatisticsMenuComponent, SubscriptionMenuComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: ItemExportService, useValue: itemExportService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: PLATFORM_ID, useValue: 'browser' },
        Injector
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [TestComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    component.contextMenuObject = dso;
    component.contextMenuObjectType = DSpaceObjectType.ITEM;
    store = TestBed.inject(Store) as MockStore<AppState>;
    configurationDataService.findByPropertyName.and.returnValues(confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$, confResponse$);
  });

  it('should return menu entries', (done) => {
    component.getContextMenuEntries().subscribe((list) => {
      expect(list.length).toBeGreaterThan(0);
      done();
    });
  });

  describe('when has authentication', () => {

    beforeEach(() => {
      spyOn(component, 'getContextMenuEntries').and.returnValue(of([]));
      fixture.detectChanges();
    });

    it('should create', (done) => {
      expect(component).toBeTruthy();
      done();
    });

    it('should display context menu', (done) => {
      const menu = fixture.debugElement.query(By.css('button#context-menu'));
      expect(menu).not.toBeNull();
      done();
    });

    it('should use d-none', (done) => {
      const menu = fixture.debugElement.query(By.css('div.d-none'));
      expect(menu).not.toBeNull();
      done();
    });

    it('should not use d-inline-block', (done) => {
      const menu = fixture.debugElement.query(By.css('div.d-inline-block'));
      expect(menu).toBeNull();
      done();
    });

    it('should display stand alone buttons', (done) => {
      const menu = fixture.debugElement.query(By.css('button.btn-primary'));
      expect(menu).not.toBeNull();
      done();
    });

    it('should not have menu entries when are disabled on rest side', (done) => {
      component.contextMenuObjectType = DSpaceObjectType.COMMUNITY;
      configurationDataService.findByPropertyName.and.returnValues(
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$,
        confResponseDisabled$
      );
      fixture.detectChanges();
      component.getContextMenuEntries().subscribe((list) => {
        expect(list.length).toBe(0);
        done();
      });
    });
  });

  describe('when has not authentication', () => {

    beforeEach(() => {
      store.setState(notAuthState);
      spyOn(component, 'getContextMenuEntries').and.returnValue(of([]));
    });

    describe('and the object type is ITEM', () => {
      beforeEach(() => {
        component.contextMenuObjectType = DSpaceObjectType.ITEM;
        fixture.detectChanges();
      });

      it('should create', (done) => {
        expect(component).toBeTruthy();
        done();
      });

      it('should display context menu', (done) => {
        const menu = fixture.debugElement.query(By.css('button#context-menu'));
        expect(menu).not.toBeNull();
        done();
      });

      it('should use d-none', (done) => {
        const menu = fixture.debugElement.query(By.css('div.d-none'));
        expect(menu).not.toBeNull();
        done();
      });

      it('should not use d-inline-block', (done) => {
        const menu = fixture.debugElement.query(By.css('div.d-inline-block'));
        expect(menu).toBeNull();
        done();
      });

      it('should display stand alone buttons', (done) => {
        const menu = fixture.debugElement.query(By.css('button.btn-primary'));
        expect(menu).not.toBeNull();
        done();
      });
    });

    describe('and the object type is not ITEM', () => {
      beforeEach(() => {
        component.contextMenuObjectType = DSpaceObjectType.COMMUNITY;
        fixture.detectChanges();
      });

      it('should create', (done) => {
        expect(component).toBeTruthy();
        done();
      });

      it('should display context menu', (done) => {
        const menu = fixture.debugElement.query(By.css('button#context-menu'));
        expect(menu).not.toBeNull();
        done();
      });

      it('should display d-inline-block', (done) => {
        const menu = fixture.debugElement.query(By.css('div.d-inline-block'));
        expect(menu).toBeNull();
        done();
      });

      it('should display d-none', (done) => {
        const menu = fixture.debugElement.query(By.css('div.d-none'));
        expect(menu).not.toBeNull();
        done();
      });
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-menu-entry',
  template: `
    <button class="dropdown-item">test menu item</button>`
})
@rendersContextMenuEntriesForType(DSpaceObjectType.COLLECTION)
class TestComponent {

}
