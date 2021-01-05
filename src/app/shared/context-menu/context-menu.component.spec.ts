import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { cold } from 'jasmine-marbles';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { AppState } from '../../app.reducer';
import { ContextMenuComponent } from './context-menu.component';
import { rendersContextMenuEntriesForType } from './context-menu.decorator';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;
  let store: MockStore<AppState>;
  let initialState;
  let dso: DSpaceObject;
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

  function init() {
    initialState = authState;

    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ContextMenuComponent, TestComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NgbDropdownModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        Injector
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ TestComponent ]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    component.contextMenuObject = dso;
    component.contextMenuObjectType = DSpaceObjectType.ITEM;
    store = TestBed.get(Store);
  });

  it('should return menu entries', () => {
    expect(component.getContextMenuEntries().length).toBeGreaterThan(0);
  });

  describe('when has authentication', () => {

    beforeEach(() => {
      spyOn(component, 'getContextMenuEntries').and.returnValue([]);
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

    it('should check the authorization of the current user', (done) => {
      expect(component.isAuthenticated).toBeObservable(cold('a', { a: true }));
      done();
    });
  });

  describe('when has not authentication', () => {

    beforeEach(() => {
      store.setState(notAuthState)
      spyOn(component, 'getContextMenuEntries').and.returnValue([]);
      fixture.detectChanges();
    });

    it('should create', (done) => {
      expect(component).toBeTruthy();
      done();
    });

    it('should not display context menu', (done) => {
      const menu = fixture.debugElement.query(By.css('button#context-menu'));
      expect(menu).toBeNull();
      done();
    });

    it('should check the authorization of the current user', (done) => {
      expect(component.isAuthenticated).toBeObservable(cold('a', { a: false }));
      done();
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-menu-entry',
  template: `<button class="dropdown-item">test menu item</button>`
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
class TestComponent {

}
