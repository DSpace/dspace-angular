import {
  Component,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CSSVariableServiceStub } from '@dspace/core/testing/css-variable-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuService } from '../../../menu/menu.service';
import { MenuItemType } from '../../../menu/menu-item-type.model';
import { MenuItemModels } from '../../../menu/menu-section.model';
import { MenuServiceStub } from '../../../menu/menu-service.stub';
import { CSSVariableService } from '../../../sass-helper/css-variable.service';
import { getMockThemeService } from '../../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { DsoEditMenuExpandableSectionComponent } from './dso-edit-menu-expandable-section.component';

describe('DsoEditMenuExpandableSectionComponent', () => {
  let component: DsoEditMenuExpandableSectionComponent;
  let fixture: ComponentFixture<DsoEditMenuExpandableSectionComponent>;
  const menuService = new MenuServiceStub();
  const iconString = 'test';

  const dummySection = {
    id: 'dummy',
    active: false,
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      disabled: false,
      text: 'text',
    },
    icon: iconString,
  };

  describe('when there are subsections', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), DsoEditMenuExpandableSectionComponent, TestMenuItemComponent],
        providers: [
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
          { provide: Router, useValue: new RouterStub() },
          { provide: ThemeService, useValue: getMockThemeService() },
        ],
      }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([
        {
          id: 'subSection1',
          visible: true,
          model: {} as MenuItemModels,
          parentID: dummySection.id,
        },
        {
          id: 'subSection2',
          visible: true,
          model: {} as MenuItemModels,
          parentID: dummySection.id,
        },
      ]));
      fixture = TestBed.createComponent(DsoEditMenuExpandableSectionComponent);
      component = fixture.componentInstance;
      component.section = dummySection;
      component.itemModel = dummySection.model;
      spyOn(component, 'getMenuItemComponent').and.returnValue(Promise.resolve(TestMenuItemComponent as any));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show a button with the icon', () => {
      const button = fixture.debugElement.query(By.css('.btn-dark'));
      expect(button.nativeElement.innerHTML).toContain('fa-' + iconString);
    });

    describe('menu button keyboard interaction', () => {
      let toggler: DebugElement;
      let dropdown: NgbDropdown;

      beforeEach(() => {
        toggler = fixture.debugElement.query(By.css('[data-test="dso-edit-menu-section-toggler"]'));
        dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
      });

      it('should open the menu and focus the first item on Enter', fakeAsync(() => {
        toggler.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }));
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        toggler.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { code: 'Enter', bubbles: true }));
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(dropdown.isOpen()).toBeTrue();
        const items = document.querySelectorAll(`#${component.expandableSectionId()} *[role="menuitem"]`);
        expect(document.activeElement).toBe(items.item(0));
      }));

      it('should open the menu and focus the last item on ArrowUp', fakeAsync(() => {
        toggler.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(dropdown.isOpen()).toBeTrue();
        const items = document.querySelectorAll(`#${component.expandableSectionId()} *[role="menuitem"]`);
        expect(document.activeElement).toBe(items.item(items.length - 1));
      }));

      describe('when the menu is open', () => {
        beforeEach(fakeAsync(() => {
          component.focusOnFirstChildSection = true;
          dropdown.open();
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
        }));

        it('should move focus to the next menuitem on ArrowDown', () => {
          const items = document.querySelectorAll(`#${component.expandableSectionId()} *[role="menuitem"]`);
          (items.item(0) as HTMLElement).focus();
          (items.item(0) as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

          expect(document.activeElement).toBe(items.item(1));
        });

        it('should close the menu on Escape and return focus to the toggle', () => {
          const items = document.querySelectorAll(`#${component.expandableSectionId()} *[role="menuitem"]`);
          (items.item(0) as HTMLElement).focus();
          (items.item(0) as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }));
          fixture.detectChanges();

          expect(dropdown.isOpen()).toBeFalse();
          expect(document.activeElement).toBe(toggler.nativeElement);
        });

        it('should close the menu on Tab', () => {
          const items = document.querySelectorAll(`#${component.expandableSectionId()} *[role="menuitem"]`);
          (items.item(0) as HTMLElement).focus();
          (items.item(0) as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab', bubbles: true }));
          fixture.detectChanges();

          expect(dropdown.isOpen()).toBeFalse();
        });
      });
    });
  });

  describe('when there are no subsections', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), DsoEditMenuExpandableSectionComponent, TestMenuItemComponent],
        providers: [
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
          { provide: Router, useValue: new RouterStub() },
          { provide: ThemeService, useValue: getMockThemeService() },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));
      fixture = TestBed.createComponent(DsoEditMenuExpandableSectionComponent);
      component = fixture.componentInstance;
      component.section = dummySection;
      spyOn(component, 'getMenuItemComponent').and.returnValue(Promise.resolve(TestMenuItemComponent as any));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should now show a button', () => {
      const button = fixture.debugElement.query(By.css('.btn-dark'));
      expect(button).toBeNull();
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-menu-item',
  template: `<a href="javascript:void(0);" role="menuitem" tabindex="0">item</a>`,
})
class TestMenuItemComponent {
}
