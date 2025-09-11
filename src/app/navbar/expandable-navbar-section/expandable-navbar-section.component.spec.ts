import {
  Component,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { LinkMenuItemModel } from '../../shared/menu/menu-item/models/link.model';
import {
  MenuItemModels,
  MenuSection,
} from '../../shared/menu/menu-section.model';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../../shared/testing/menu-service.stub';
import { HoverOutsideDirective } from '../../shared/utils/hover-outside.directive';
import { ExpandableNavbarSectionComponent } from './expandable-navbar-section.component';

describe('ExpandableNavbarSectionComponent', () => {
  let component: ExpandableNavbarSectionComponent;
  let fixture: ComponentFixture<ExpandableNavbarSectionComponent>;
  const menuService = new MenuServiceStub();

  describe('on larger screens', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ExpandableNavbarSectionComponent,
          HoverOutsideDirective,
          NoopAnimationsModule,
          TestComponent,
        ],
        providers: [
          { provide: 'sectionDataProvider', useValue: {} },
          { provide: MenuService, useValue: menuService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
          TestComponent,
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([{ id: 'test', visible: true, model: {} as MenuItemModels }]));

      fixture = TestBed.createComponent(ExpandableNavbarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    describe('when the mouse enters the section header (while inactive)', () => {
      beforeEach(() => {
        spyOn(component, 'onMouseEnter').and.callThrough();
        spyOn(component, 'activateSection').and.callThrough();
        spyOn(menuService, 'activateSection');
        // Make sure section is 'inactive'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(false));
        component.ngOnInit();
        fixture.detectChanges();

        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-wrapper"]'));
        sidebarToggler.triggerEventHandler('mouseenter', {
          preventDefault: () => {/**/
          },
        });
      });

      it('should call onMouseEnter', () => {
        expect(component.onMouseEnter).toHaveBeenCalled();
      });

      it('should activate the section', () => {
        expect(component.activateSection).toHaveBeenCalled();
        expect(menuService.activateSection).toHaveBeenCalled();
      });
    });

    describe('when the mouse leaves the section header (while active)', () => {
      beforeEach(() => {
        spyOn(component, 'onMouseLeave').and.callThrough();
        spyOn(component, 'deactivateSection').and.callThrough();
        spyOn(menuService, 'deactivateSection');
        // Make sure section is 'active'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(true));
        component.ngOnInit();
        component.mouseEntered = true;
        fixture.detectChanges();

        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-wrapper"]'));
        sidebarToggler.triggerEventHandler('mouseleave', {
          preventDefault: () => {/**/
          },
        });
      });

      it('should call onMouseLeave', () => {
        expect(component.onMouseLeave).toHaveBeenCalled();
      });

      it('should deactivate the section', () => {
        expect(component.deactivateSection).toHaveBeenCalled();
        expect(menuService.deactivateSection).toHaveBeenCalled();
      });
    });

    describe('when Enter key is pressed on section header (while inactive)', () => {
      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'inactive'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(false));
        component.ngOnInit();
        fixture.detectChanges();

        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
        // dispatch the (keyup.enter) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      });

      it('should call activateSection on the menuService', () => {
        expect(component.toggleSection).toHaveBeenCalled();
        expect(menuService.toggleActiveSection).toHaveBeenCalled();
      });
    });

    describe('when Enter key is pressed on section header (while active)', () => {
      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'active'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(true));
        component.ngOnInit();
        fixture.detectChanges();

        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
        // dispatch the (keyup.enter) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      });

      it('should call toggleSection on the menuService', () => {
        expect(component.toggleSection).toHaveBeenCalled();
        expect(menuService.toggleActiveSection).toHaveBeenCalled();
      });
    });

    describe('when spacebar is pressed on section header (while inactive)', () => {
      let sidebarToggler: DebugElement;

      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'inactive'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(false));
        component.ngOnInit();
        fixture.detectChanges();

        sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
      });

      it('should call toggleSection on the menuService', () => {
        // dispatch the (keyup.space) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }));

        expect(component.toggleSection).toHaveBeenCalled();
        expect(menuService.toggleActiveSection).toHaveBeenCalled();
      });

      // Should not do anything in order to work correctly with NVDA: https://www.nvaccess.org/
      it('should not do anything on keydown space', () => {
        const event: Event = new KeyboardEvent('keydown', { code: 'Space', key: ' ' });
        spyOn(event, 'preventDefault').and.callThrough();

        // dispatch the (keyup.space) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('when spacebar is pressed on section header (while active)', () => {
      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'active'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(true));
        component.ngOnInit();
        fixture.detectChanges();

        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
        // dispatch the (keyup.space) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      });

      it('should call toggleSection on the menuService', () => {
        expect(component.toggleSection).toHaveBeenCalled();
        expect(menuService.toggleActiveSection).toHaveBeenCalled();
      });
    });

    describe('when enter is pressed on section header (while inactive)', () => {
      let sidebarToggler: DebugElement;

      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'inactive'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(of(false));
        component.ngOnInit();
        fixture.detectChanges();

        sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
      });

      // Should not do anything in order to work correctly with NVDA: https://www.nvaccess.org/
      it('should not do anything on keydown space', () => {
        const event: Event = new KeyboardEvent('keydown', { code: 'Enter' });
        spyOn(event, 'preventDefault').and.callThrough();

        // dispatch the (keyup.space) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('when arrow down is pressed on section header', () => {
      it('should call activateSection', () => {
        spyOn(component, 'activateSection').and.callThrough();

        const sidebarToggler: DebugElement = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
        // dispatch the (keydown.ArrowDown) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));

        expect(component.focusOnFirstChildSection).toBe(true);
        expect(component.activateSection).toHaveBeenCalled();
      });
    });

    describe('when tab is pressed on section header', () => {
      it('should call deactivateSection', () => {
        spyOn(component, 'deactivateSection').and.callThrough();

        const sidebarToggler: DebugElement = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
        // dispatch the (keydown.ArrowDown) action used in our component HTML
        sidebarToggler.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

        expect(component.deactivateSection).toHaveBeenCalled();
      });
    });

    describe('navigateDropdown', () => {
      beforeEach(fakeAsync(() => {
        jasmine.getEnv().allowRespy(true);
        spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([
          {
            id: 'subSection1',
            model: Object.assign(new LinkMenuItemModel(), {
              type: 'TEST_LINK',
            }),
            visible: true,
            parentID: component.section.id,
          },
          {
            id: 'subSection2',
            model: Object.assign(new LinkMenuItemModel(), {
              type: 'TEST_LINK',
            }),
            visible: true,
            parentID: component.section.id,
          },
        ] as MenuSection[]));
        component.ngOnInit();
        flush();
        fixture.detectChanges();
        component.focusOnFirstChildSection = true;
        component.active$.next(true);
        fixture.detectChanges();
      }));

      it('should close the modal on Tab', () => {
        spyOn(menuService, 'deactivateSection').and.callThrough();

        const firstSubsection: DebugElement = fixture.debugElement.queryAll(By.css('.dropdown-menu a[role="menuitem"]'))[0];
        firstSubsection.nativeElement.focus();
        firstSubsection.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

        expect(menuService.deactivateSection).toHaveBeenCalled();
      });

      it('should close the modal on Escape', () => {
        spyOn(menuService, 'deactivateSection').and.callThrough();

        const firstSubsection: DebugElement = fixture.debugElement.queryAll(By.css('.dropdown-menu a[role="menuitem"]'))[0];
        firstSubsection.nativeElement.focus();
        firstSubsection.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));

        expect(menuService.deactivateSection).toHaveBeenCalled();
      });
    });
  });

  describe('on smaller, mobile screens', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ExpandableNavbarSectionComponent,
          HoverOutsideDirective,
          NoopAnimationsModule,
          TestComponent,
        ],
        providers: [
          { provide: 'sectionDataProvider', useValue: {} },
          { provide: MenuService, useValue: menuService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(300) },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([{ id: 'test', visible: true, model: {} as MenuItemModels }]));

      fixture = TestBed.createComponent(ExpandableNavbarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    describe('when the mouse enters the section header', () => {
      beforeEach(() => {
        spyOn(menuService, 'activateSection');
        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-wrapper"]'));
        sidebarToggler.triggerEventHandler('mouseenter', {
          preventDefault: () => {/**/
          },
        });
      });

      it('should not call activateSection on the menuService', () => {
        expect(menuService.activateSection).not.toHaveBeenCalled();
      });
    });

    describe('when the mouse leaves the section header', () => {
      beforeEach(() => {
        spyOn(menuService, 'deactivateSection');
        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-wrapper"]'));
        sidebarToggler.triggerEventHandler('mouseleave', {
          preventDefault: () => {/**/
          },
        });
      });

      it('should not call deactivateSection on the menuService', () => {
        expect(menuService.deactivateSection).not.toHaveBeenCalled();
      });
    });

    describe('when a click occurs on the section header link', () => {
      beforeEach(() => {
        spyOn(menuService, 'toggleActiveSection');
        const sidebarToggler = fixture.debugElement.query(By.css('[data-test="navbar-section-toggler"]'));
        sidebarToggler.triggerEventHandler('click', {
          preventDefault: () => {/**/
          },
        });
      });

      it('should call toggleActiveSection on the menuService', () => {
        expect(menuService.toggleActiveSection).toHaveBeenCalled();
      });
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: `
    <a role="menuitem">link</a>
  `,
  standalone: true,
})
class TestComponent {
}
