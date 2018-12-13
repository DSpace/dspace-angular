import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuComponent } from './menu.component';
import { MenuServiceStub } from '../testing/menu-service-stub';
import { of as observableOf } from 'rxjs';
import { MenuSection } from './menu.reducer';

describe('MenuComponent', () => {
  let comp: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuService: MenuService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [MenuComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: MenuService, useClass: MenuServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MenuComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    menuService = (comp as any).menuService;
    spyOn(comp as any, 'getSectionDataInjector').and.returnValue(MenuSection);
    spyOn(comp as any, 'getSectionComponent').and.returnValue(observableOf({}));
    fixture.detectChanges();
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
    beforeEach(() => {
      spyOn(menuService, 'expandMenuPreview');
      comp.expandPreview(new Event('click'));
    });
    it('should trigger the expandPreview function on the menu service', () => {
      expect(menuService.expandMenuPreview).toHaveBeenCalledWith(comp.menuID);
    })
  });

  describe('collapsePreview', () => {
    beforeEach(() => {
      spyOn(menuService, 'collapseMenuPreview');
      comp.collapsePreview(new Event('click'));
    });
    it('should trigger the collapsePreview function on the menu service', () => {
      expect(menuService.collapseMenuPreview).toHaveBeenCalledWith(comp.menuID);
    })
  });
});
