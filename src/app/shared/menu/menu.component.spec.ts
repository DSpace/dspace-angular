// eslint-disable-next-line max-classes-per-file
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  RouterModule,
} from '@angular/router';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import {
  AppState,
  storeModuleConfig,
} from '../../app.reducer';
import { authReducer } from '../../core/auth/auth.reducer';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../core/shared/item.model';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { ThemeService } from '../theme-support/theme.service';
import { MenuComponent } from './menu.component';
import { MenuService } from './menu.service';
import { MenuID } from './menu-id.model';
import { LinkMenuItemModel } from './menu-item/models/link.model';
import { TextMenuItemModel } from './menu-item/models/text.model';
import { MenuItemType } from './menu-item-type.model';
import { rendersSectionForMenu } from './menu-section.decorator';
import { MenuSection } from './menu-section.model';

const mockMenuID = 'mock-menuID' as MenuID;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '',
  standalone: true,
})
@rendersSectionForMenu(mockMenuID, true)
class TestExpandableMenuComponent {
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '',
  standalone: true,
})
@rendersSectionForMenu(mockMenuID, false)
class TestMenuComponent {
}

describe('MenuComponent', () => {
  let comp: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuService: MenuService;
  let store: MockStore;

  const menuSection: MenuSection =       {
    id: 'browse',
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.browse_global',
    } as TextMenuItemModel,
    icon: 'globe',
    visible: true,
  };

  let authorizationService: AuthorizationDataService;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    _links: {
      self: {
        href: 'https://localhost:8000/items/fake-id',
      },
    },
  });


  const routeStub = {
    data: of({
      dso: createSuccessfulRemoteDataObject(mockItem),
    }),
    children: [],
  };

  const parentSection: MenuSection = {
    id: 'section1',
    active: false,
    visible: true,
    alwaysRenderExpandable: false,
    model: {
      type: MenuItemType.LINK,
      text: 'test',
      link: '/test',
    } as LinkMenuItemModel,
  };

  const childSection: MenuSection = {
    id: 'test',
    parentID: 'section1',
    active: false,
    visible: true,
    alwaysRenderExpandable: false,
    model: {
      type: MenuItemType.LINK,
      text: 'test',
      link: '/test',
    } as LinkMenuItemModel,
  };

  const initialState = {
    menus: {
      [mockMenuID]: {
        collapsed: true,
        id: mockMenuID,
        previewCollapsed: true,
        sectionToSubsectionIndex: {
          section1: [],
        },
        sections: {
          section1: parentSection,
        },
        visible: true,
      },
    },
  };

  beforeEach(waitForAsync(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(false),
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        MenuComponent,
        StoreModule.forRoot(authReducer, storeModuleConfig),
        TestExpandableMenuComponent,
        TestMenuComponent,
      ],
      providers: [
        Injector,
        { provide: ThemeService, useValue: getMockThemeService() },
        MenuService,
        provideMockStore({ initialState }),
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ActivatedRoute, useValue: routeStub },
      ],
    }).overrideComponent(MenuComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    comp = fixture.componentInstance;
    comp.menuID = mockMenuID;
    menuService = TestBed.inject(MenuService);
    store = TestBed.inject(Store) as MockStore<AppState>;
    jasmine.getEnv().allowRespy(true);
    spyOn(comp, 'getSectionComponent').withArgs(parentSection).and.returnValue(of(TestMenuComponent));
    spyOn(comp, 'getSectionComponent').withArgs(childSection).and.returnValue(of(TestExpandableMenuComponent));
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should trigger the section observable again when a new sub section has been added', () => {
      spyOn(store, 'dispatch').and.callThrough();

      store.setState({
        menus: {
          [mockMenuID]: {
            collapsed: true,
            id: mockMenuID,
            previewCollapsed: true,
            sectionToSubsectionIndex: {
              section1: ['test'],
            },
            sections: {
              section1: parentSection,
              test: childSection,
            },
            visible: true,
          },
        },
      });

      expect(comp.sectionDTOs$).toBeObservable(cold('a', {
        a: [
          {
            menuSection: parentSection,
            hasSubSections: true,
          },
        ],
      }));
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      spyOn(menuService, 'toggleMenu');
      comp.toggle(new Event('click'));
    });
    it('should trigger the toggleMenu function on the menu service', () => {
      expect(menuService.toggleMenu).toHaveBeenCalledWith(comp.menuID);
    });
  });

  describe('expand', () => {
    beforeEach(() => {
      spyOn(menuService, 'expandMenu');
      comp.expand(new Event('click'));
    });
    it('should trigger the expandMenu function on the menu service', () => {
      expect(menuService.expandMenu).toHaveBeenCalledWith(comp.menuID);
    });
  });

  describe('collapse', () => {
    beforeEach(() => {
      spyOn(menuService, 'collapseMenu');
      comp.collapse(new Event('click'));
    });
    it('should trigger the collapseMenu function on the menu service', () => {
      expect(menuService.collapseMenu).toHaveBeenCalledWith(comp.menuID);
    });
  });

  describe('expandPreview', () => {
    it('should trigger the expandPreview function on the menu service after 100ms', fakeAsync(() => {
      spyOn(menuService, 'expandMenuPreview');
      comp.expandPreview(new Event('click'));
      tick(99);
      expect(menuService.expandMenuPreview).not.toHaveBeenCalled();
      tick(1);
      expect(menuService.expandMenuPreview).toHaveBeenCalledWith(comp.menuID);
    }));
  });

  describe('collapsePreview', () => {
    it('should trigger the collapsePreview function on the menu service after 400ms', fakeAsync(() => {
      spyOn(menuService, 'collapseMenuPreview');
      comp.collapsePreview(new Event('click'));
      tick(399);
      expect(menuService.collapseMenuPreview).not.toHaveBeenCalled();
      tick(1);
      expect(menuService.collapseMenuPreview).toHaveBeenCalledWith(comp.menuID);
    }));
  });
});
