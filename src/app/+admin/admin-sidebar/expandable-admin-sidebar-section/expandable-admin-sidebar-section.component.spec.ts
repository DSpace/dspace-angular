import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableAdminSidebarSectionComponent } from './expandable-admin-sidebar-section.component';
import { MenuService } from '../../../shared/menu/menu.service';
import { MenuServiceStub } from '../../../shared/testing/menu-service.stub';
import { CSSVariableService } from '../../../shared/sass-helper/sass-helper.service';
import { CSSVariableServiceStub } from '../../../shared/testing/css-variable-service.stub';
import { of as observableOf } from 'rxjs';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('ExpandableAdminSidebarSectionComponent', () => {
  let component: ExpandableAdminSidebarSectionComponent;
  let fixture: ComponentFixture<ExpandableAdminSidebarSectionComponent>;
  const menuService = new MenuServiceStub();
  const iconString = 'test';
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [ExpandableAdminSidebarSectionComponent, TestComponent],
      providers: [
        { provide: 'sectionDataProvider', useValue: {icon: iconString} },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
      ]
    }).overrideComponent(ExpandableAdminSidebarSectionComponent, {
      set: {
        entryComponents: [TestComponent]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(observableOf([]));
    fixture = TestBed.createComponent(ExpandableAdminSidebarSectionComponent);
    component = fixture.componentInstance;
    spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the right icon', () => {
    const icon = fixture.debugElement.query(By.css('.icon-wrapper')).query(By.css('i.fas'));
    expect(icon.nativeElement.getAttribute('class')).toContain('fa-' + iconString);
  });

  describe('when the icon is clicked', () => {
    beforeEach(() => {
      spyOn(menuService, 'toggleActiveSection');
      const sidebarToggler = fixture.debugElement.query(By.css('a.shortcut-icon'));
      sidebarToggler.triggerEventHandler('click', {preventDefault: () => {/**/}});
    });

    it('should call toggleActiveSection on the menuService', () => {
      expect(menuService.toggleActiveSection).toHaveBeenCalled();
    });
  });

  describe('when the header text is clicked', () => {
    beforeEach(() => {
      spyOn(menuService, 'toggleActiveSection');
      const sidebarToggler = fixture.debugElement.query(By.css('.sidebar-collapsible')).query(By.css('a'));
      sidebarToggler.triggerEventHandler('click', {preventDefault: () => {/**/}});
    });

    it('should call toggleActiveSection on the menuService', () => {
      expect(menuService.toggleActiveSection).toHaveBeenCalled();
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
