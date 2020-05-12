import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableNavbarSectionComponent } from './expandable-navbar-section.component';
import { By } from '@angular/platform-browser';
import { MenuServiceStub } from '../../shared/testing/menu-service.stub';
import { Component } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ExpandableNavbarSectionComponent', () => {
  let component: ExpandableNavbarSectionComponent;
  let fixture: ComponentFixture<ExpandableNavbarSectionComponent>;
  const menuService = new MenuServiceStub();

  describe('on larger screens', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        declarations: [ExpandableNavbarSectionComponent, TestComponent],
        providers: [
          { provide: 'sectionDataProvider', useValue: {} },
          { provide: MenuService, useValue: menuService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(800) }
        ]
      }).overrideComponent(ExpandableNavbarSectionComponent, {
        set: {
          entryComponents: [TestComponent]
        }
      })
        .compileComponents();
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

    describe('when the mouse enters the section header', () => {
      beforeEach(() => {
        spyOn(menuService, 'activateSection');
        const sidebarToggler = fixture.debugElement.query(By.css('li.nav-item.dropdown'));
        sidebarToggler.triggerEventHandler('mouseenter', {
          preventDefault: () => {/**/
          }
        });
      });

      it('should call activateSection on the menuService', () => {
        expect(menuService.activateSection).toHaveBeenCalled();
      });
    });

    describe('when the mouse leaves the section header', () => {
      beforeEach(() => {
        spyOn(menuService, 'deactivateSection');
        const sidebarToggler = fixture.debugElement.query(By.css('li.nav-item.dropdown'));
        sidebarToggler.triggerEventHandler('mouseleave', {
          preventDefault: () => {/**/
          }
        });
      });

      it('should call deactivateSection on the menuService', () => {
        expect(menuService.deactivateSection).toHaveBeenCalled();
      });
    });

    describe('when a click occurs on the section header', () => {
      beforeEach(() => {
        spyOn(menuService, 'toggleActiveSection');
        const sidebarToggler = fixture.debugElement.query(By.css('li.nav-item.dropdown')).query(By.css('a'));
        sidebarToggler.triggerEventHandler('click', {
          preventDefault: () => {/**/
          }
        });
      });

      it('should not call toggleActiveSection on the menuService', () => {
        expect(menuService.toggleActiveSection).not.toHaveBeenCalled();
      });
    });
  });

  describe('on smaller, mobile screens', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        declarations: [ExpandableNavbarSectionComponent, TestComponent],
        providers: [
          { provide: 'sectionDataProvider', useValue: {} },
          { provide: MenuService, useValue: menuService },
          { provide: HostWindowService, useValue: new HostWindowServiceStub(300) }
        ]
      }).overrideComponent(ExpandableNavbarSectionComponent, {
        set: {
          entryComponents: [TestComponent]
        }
      })
        .compileComponents();
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
        const sidebarToggler = fixture.debugElement.query(By.css('li.nav-item.dropdown'));
        sidebarToggler.triggerEventHandler('mouseenter', {
          preventDefault: () => {/**/
          }
        });
      });

      it('should not call activateSection on the menuService', () => {
        expect(menuService.activateSection).not.toHaveBeenCalled();
      });
    });

    describe('when the mouse leaves the section header', () => {
      beforeEach(() => {
        spyOn(menuService, 'deactivateSection');
        const sidebarToggler = fixture.debugElement.query(By.css('li.nav-item.dropdown'));
        sidebarToggler.triggerEventHandler('mouseleave', {
          preventDefault: () => {/**/
          }
        });
      });

      it('should not call deactivateSection on the menuService', () => {
        expect(menuService.deactivateSection).not.toHaveBeenCalled();
      });
    });

    describe('when a click occurs on the section header link', () => {
      beforeEach(() => {
        spyOn(menuService, 'toggleActiveSection');
        const sidebarToggler = fixture.debugElement.query(By.css('li.nav-item.dropdown')).query(By.css('a'));
        sidebarToggler.triggerEventHandler('click', {
          preventDefault: () => {/**/
          }
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
  template: ``
})
class TestComponent {
}
