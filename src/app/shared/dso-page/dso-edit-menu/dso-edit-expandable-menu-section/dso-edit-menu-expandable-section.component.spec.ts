import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuService } from '../../../menu/menu.service';
import { MenuItemType } from '../../../menu/menu-item-type.model';
import { MenuItemModels } from '../../../menu/menu-section.model';
import { CSSVariableService } from '../../../sass-helper/css-variable.service';
import { CSSVariableServiceStub } from '../../../testing/css-variable-service.stub';
import { MenuServiceStub } from '../../../testing/menu-service.stub';
import { RouterStub } from '../../../testing/router.stub';
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
        imports: [TranslateModule.forRoot(), DsoEditMenuExpandableSectionComponent, TestComponent],
        providers: [
          { provide: 'sectionDataProvider', useValue: dummySection },
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
      fixture = TestBed.createComponent(DsoEditMenuExpandableSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show a button with the icon', () => {
      const button = fixture.debugElement.query(By.css('.btn-dark'));
      expect(button.nativeElement.innerHTML).toContain('fa-' + iconString);
    });
  });

  describe('when there are no subsections', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), DsoEditMenuExpandableSectionComponent, TestComponent],
        providers: [
          { provide: 'sectionDataProvider', useValue: dummySection },
          { provide: MenuService, useValue: menuService },
          { provide: CSSVariableService, useClass: CSSVariableServiceStub },
          { provide: Router, useValue: new RouterStub() },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));
      fixture = TestBed.createComponent(DsoEditMenuExpandableSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
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
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
})
class TestComponent {
}
