import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CSSVariableServiceStub } from '@dspace/core/testing/css-variable-service.stub';
import { TranslateModule } from '@ngx-translate/core';

import { MenuService } from '../../../shared/menu/menu.service';
import { MenuItemType } from '../../../shared/menu/menu-item-type.model';
import { MenuServiceStub } from '../../../shared/menu/menu-service.stub';
import { CSSVariableService } from '../../../shared/sass-helper/css-variable.service';
import { AdminSidebarSectionComponent } from './admin-sidebar-section.component';

describe('AdminSidebarSectionComponent', () => {
  let component: AdminSidebarSectionComponent;
  let fixture: ComponentFixture<AdminSidebarSectionComponent>;
  const menuService = new MenuServiceStub();
  const iconString = 'test';

  describe('when not disabled', () => {

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          RouterTestingModule,
          TranslateModule.forRoot(),
          AdminSidebarSectionComponent,
          TestComponent,
        ],
        providers: [
          {
            provide: 'sectionDataProvider',
            useValue: { model: { link: 'google.com' }, icon: iconString },
          },
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminSidebarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set the right icon', () => {
      const icon = fixture.debugElement
        .query(By.css('[data-test="sidebar-section-icon"]'))
        .query(By.css('i.fas'));
      expect(icon.nativeElement.getAttribute('class')).toContain('fa-' + iconString);
    });

    it('should not contain the disabled class', () => {
      const disabled = fixture.debugElement.query(By.css('.disabled'));
      expect(disabled).toBeFalsy();
    });

    it('should navigate on keypress', () => {
      const routerSpy = spyOn((component as any).router, 'navigate');
      const event = { preventDefault: jasmine.createSpy() };
      component.navigate(event);
      expect(routerSpy).toHaveBeenCalled();
    });

  });

  describe('when disabled', () => {

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          RouterTestingModule,
          TranslateModule.forRoot(),
          AdminSidebarSectionComponent,
          TestComponent,
        ],
        providers: [
          {
            provide: 'sectionDataProvider',
            useValue: { model: { link: 'google.com', disabled: true }, icon: iconString },
          },
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminSidebarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set the right icon', () => {
      const icon = fixture.debugElement
        .query(By.css('[data-test="sidebar-section-icon"]'))
        .query(By.css('i.fas'));
      expect(icon.nativeElement.getAttribute('class')).toContain('fa-' + iconString);
    });

    it('should contain the disabled class', () => {
      const disabled = fixture.debugElement.query(By.css('.disabled'));
      expect(disabled).toBeTruthy();
    });

    it('should not navigate when disabled', () => {
      const routerSpy = spyOn((component as any).router, 'navigate');
      spyOn(window, 'open');
      const event = { preventDefault: jasmine.createSpy() };
      component.navigate(event);
      expect(routerSpy).not.toHaveBeenCalled();
      expect(window.open).not.toHaveBeenCalled();
    });

  });

  describe('when external link', () => {

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          RouterTestingModule,
          TranslateModule.forRoot(),
          AdminSidebarSectionComponent,
          TestComponent,
        ],
        providers: [
          {
            provide: 'sectionDataProvider',
            useValue: {
              model: {
                type: MenuItemType.EXTERNAL,
                href: 'https://test.com',
              },
              icon: iconString,
            },
          },
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminSidebarSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should detect external link', () => {
      expect(component.isExternalLink).toBeTrue();
    });

    it('should render external link icon', () => {
      const icon = fixture.debugElement.query(By.css('.fa-external-link'));
      expect(icon).toBeTruthy();
    });

    it('should not be disabled when external href exists', () => {
      expect(component.isDisabled).toBeFalse();
    });

    it('should open external link on navigate', () => {
      spyOn(window, 'open');
      const event = { preventDefault: jasmine.createSpy() };
      component.navigate(event);
      expect(window.open).toHaveBeenCalledWith('https://test.com', '_blank');
    });

  });

});

// test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  imports: [
    RouterTestingModule,
  ],
})
class TestComponent {}
