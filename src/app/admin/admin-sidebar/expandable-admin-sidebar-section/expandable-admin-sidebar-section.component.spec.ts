import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuService } from '../../../shared/menu/menu.service';
import { MenuItemModels } from '../../../shared/menu/menu-section.model';
import { CSSVariableService } from '../../../shared/sass-helper/css-variable.service';
import { CSSVariableServiceStub } from '../../../shared/testing/css-variable-service.stub';
import { MenuServiceStub } from '../../../shared/testing/menu-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { ExpandableAdminSidebarSectionComponent } from './expandable-admin-sidebar-section.component';

describe('ExpandableAdminSidebarSectionComponent', () => {
  let component: ExpandableAdminSidebarSectionComponent;
  let fixture: ComponentFixture<ExpandableAdminSidebarSectionComponent>;
  const menuService = new MenuServiceStub();
  const iconString = 'test';


  describe('when there are subsections', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, TranslateModule.forRoot(), ExpandableAdminSidebarSectionComponent, TestComponent],
        providers: [
          { provide: 'sectionDataProvider', useValue: { icon: iconString, model: {} } },
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
          { provide: Router, useValue: new RouterStub() },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([{
        id: 'test',
        visible: true,
        model: {} as MenuItemModels,
      }]));
      fixture = TestBed.createComponent(ExpandableAdminSidebarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set the right icon', () => {
      const icon = fixture.debugElement.query(By.css('[data-test="sidebar-section-icon"] > i.fas'));
      expect(icon.nativeElement.getAttribute('class')).toContain('fa-' + iconString);
    });

    describe('when the header text is clicked', () => {
      beforeEach(() => {
        spyOn(menuService, 'toggleActiveSection');
        const sidebarToggler = fixture.debugElement.query(By.css('a.sidebar-section-wrapper'));
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


  describe('when there are no subsections', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, TranslateModule.forRoot(), ExpandableAdminSidebarSectionComponent, TestComponent],
        providers: [
          { provide: 'sectionDataProvider', useValue: { icon: iconString, model: {} } },
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
          { provide: Router, useValue: new RouterStub() },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));
      fixture = TestBed.createComponent(ExpandableAdminSidebarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not contain a section', () => {
      const icon = fixture.debugElement.query(By.css('.shortcut-icon'));
      expect(icon).toBeNull();
      const sidebarToggler = fixture.debugElement.query(By.css('.sidebar-section'));
      expect(sidebarToggler).toBeNull();
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
