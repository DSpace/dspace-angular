import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf } from 'rxjs';

import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../../shared/testing/menu-service.stub';
import { VarDirective } from '../../shared/utils/var.directive';
import { ExpandableNavbarSectionComponent } from './expandable-navbar-section.component';

describe('ExpandableNavbarSectionComponent', () => {
  let component: ExpandableNavbarSectionComponent;
  let fixture: ComponentFixture<ExpandableNavbarSectionComponent>;
  const menuService = new MenuServiceStub();

  describe('on larger screens', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, ExpandableNavbarSectionComponent, TestComponent, VarDirective],
        providers: [
          { provide: 'sectionDataProvider', useValue: {} },
          { provide: MenuService, useValue: menuService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(observableOf([]));

      fixture = TestBed.createComponent(ExpandableNavbarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('when the mouse enters the section header (while inactive)', () => {
      beforeEach(() => {
        spyOn(component, 'onMouseEnter').and.callThrough();
        spyOn(component, 'activateSection').and.callThrough();
        spyOn(menuService, 'activateSection');
        // Make sure section is 'inactive'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(observableOf(false));
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
        spyOn(menuService, 'isSectionActive').and.returnValue(observableOf(true));
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
        spyOn(menuService, 'isSectionActive').and.returnValue(observableOf(false));
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
        spyOn(menuService, 'isSectionActive').and.returnValue(observableOf(true));
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
      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'inactive'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(observableOf(false));
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

    describe('when spacebar is pressed on section header (while active)', () => {
      beforeEach(() => {
        spyOn(component, 'toggleSection').and.callThrough();
        spyOn(menuService, 'toggleActiveSection');
        // Make sure section is 'active'. Requires calling ngOnInit() to update component 'active' property.
        spyOn(menuService, 'isSectionActive').and.returnValue(observableOf(true));
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
  });

  describe('on smaller, mobile screens', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, ExpandableNavbarSectionComponent, TestComponent, VarDirective],
        providers: [
          { provide: 'sectionDataProvider', useValue: {} },
          { provide: MenuService, useValue: menuService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(300) },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(observableOf([]));

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
  template: ``,
  standalone: true,
})
class TestComponent {
}
