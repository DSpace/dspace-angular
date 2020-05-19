import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuComponent } from './menu.component';
import { MenuServiceStub } from '../testing/menu-service.stub';
import { of as observableOf } from 'rxjs';
import { MenuSection } from './menu.reducer';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuID, MenuItemType } from './initial-menus-state';
import { LinkMenuItemModel } from './menu-item/models/link.model';

describe('MenuComponent', () => {
  let comp: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuService: MenuService;
  let routeDataMenuSection: MenuSection;
  let routeDataMenuChildSection: MenuSection;
  let route: any;
  let router: any;

  const mockMenuID = 'mock-menuID' as MenuID;

  beforeEach(async(() => {
    routeDataMenuSection = {
      id: 'mockSection',
      active: false,
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.mockSection',
        link: ''
      } as LinkMenuItemModel
    };
    routeDataMenuChildSection = {
      id: 'mockChildSection',
      parentID: 'mockSection',
      active: false,
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.mockChildSection',
        link: ''
      } as LinkMenuItemModel
    };
    route = {
      root: {
        snapshot: {
          data: {
            menu: {
              [mockMenuID]: routeDataMenuSection
            }
          }
        },
        firstChild: {
          snapshot: {
            data: {
              menu: {
                [mockMenuID]: routeDataMenuChildSection
              }
            }
          }
        }
      }
    };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, RouterTestingModule],
      declarations: [MenuComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: MenuService, useClass: MenuServiceStub },
        { provide: ActivatedRoute, useValue: route }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MenuComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.menuID = mockMenuID;
    menuService = (comp as any).menuService;
    router = TestBed.get(Router);
    spyOn(comp as any, 'getSectionDataInjector').and.returnValue(MenuSection);
    spyOn(comp as any, 'getSectionComponent').and.returnValue(observableOf({}));
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(comp, 'resolveMenuSections').and.returnValue([]);
    });

    it('should call resolveMenuSections on init', () => {
      router.events = observableOf(new NavigationEnd(0, '', ''));
      comp.ngOnInit();
      expect(comp.resolveMenuSections).toHaveBeenCalledWith(route.root);
    })
  });

  describe('resolveMenuSections', () => {
    let result: MenuSection[];

    beforeEach(() => {
      result = comp.resolveMenuSections(route.root);
    });

    it('should return the current route\'s menu sections', () => {
      expect(result).toEqual([routeDataMenuSection, routeDataMenuChildSection])
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      spyOn(menuService, 'toggleMenu');
      comp.toggle(new Event('click'));
    });
    it('should trigger the toggleMenu function on the menu service', () => {
      expect(menuService.toggleMenu).toHaveBeenCalledWith(comp.menuID);
    })
  });

  describe('expand', () => {
    beforeEach(() => {
      spyOn(menuService, 'expandMenu');
      comp.expand(new Event('click'));
    });
    it('should trigger the expandMenu function on the menu service', () => {
      expect(menuService.expandMenu).toHaveBeenCalledWith(comp.menuID);
    })
  });

  describe('collapse', () => {
    beforeEach(() => {
      spyOn(menuService, 'collapseMenu');
      comp.collapse(new Event('click'));
    });
    it('should trigger the collapseMenu function on the menu service', () => {
      expect(menuService.collapseMenu).toHaveBeenCalledWith(comp.menuID);
    })
  });

  describe('expandPreview', () => {
    it('should trigger the expandPreview function on the menu service after 100ms', fakeAsync(() => {
      spyOn(menuService, 'expandMenuPreview');
      comp.expandPreview(new Event('click'));
      tick(99);
      expect(menuService.expandMenuPreview).not.toHaveBeenCalled();
      tick(1);
      expect(menuService.expandMenuPreview).toHaveBeenCalledWith(comp.menuID);
    }))
  });

  describe('collapsePreview', () => {
    it('should trigger the collapsePreview function on the menu service after 400ms', fakeAsync(() => {
      spyOn(menuService, 'collapseMenuPreview');
      comp.collapsePreview(new Event('click'));
      tick(399);
      expect(menuService.collapseMenuPreview).not.toHaveBeenCalled();
      tick(1);
      expect(menuService.collapseMenuPreview).toHaveBeenCalledWith(comp.menuID);
    }))
  });
});
