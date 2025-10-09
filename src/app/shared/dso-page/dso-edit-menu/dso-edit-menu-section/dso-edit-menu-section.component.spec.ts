import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MenuItemType } from 'src/app/shared/menu/menu-item-type.model';

import { MenuService } from '../../../menu/menu.service';
import { OnClickMenuItemModel } from '../../../menu/menu-item/models/onclick.model';
import { CSSVariableService } from '../../../sass-helper/css-variable.service';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { CSSVariableServiceStub } from '../../../testing/css-variable-service.stub';
import { MenuServiceStub } from '../../../testing/menu-service.stub';
import { RouterStub } from '../../../testing/router.stub';
import { DsoEditMenuSectionComponent } from './dso-edit-menu-section.component';

function initAsync(dummySectionText: {
  visible: boolean;
  icon: string;
  active: boolean;
  model: { disabled: boolean; text: string; type: MenuItemType };
  id: string
}, menuService: MenuServiceStub) {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        DsoEditMenuSectionComponent,
        TestComponent,
      ],
      providers: [
        { provide: 'sectionDataProvider', useValue: dummySectionText },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();
  }));
}

describe('DsoEditMenuSectionComponent', () => {
  let component: DsoEditMenuSectionComponent;
  let fixture: ComponentFixture<DsoEditMenuSectionComponent>;
  const menuService = new MenuServiceStub();
  const iconString = 'test';

  const dummySectionText = {
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
  const dummySectionLink = {
    id: 'dummy',
    active: false,
    visible: true,
    model: {
      type: MenuItemType.LINK,
      disabled: false,
      text: 'text',
      link: 'link',
    },
    icon: iconString,
  };
  const dummySectionClick = {
    id: 'dummy',
    active: false,
    visible: true,
    model: {
      type: MenuItemType.ONCLICK,
      disabled: false,
      text: 'text',
      function: () => 'test',
    },
    icon: iconString,
  };

  describe('text model', () => {
    initAsync(dummySectionText, menuService);

    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));
      fixture = TestBed.createComponent(DsoEditMenuSectionComponent);
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

    describe('when the section model in a disabled link or text', () => {
      it('should show just the button', () => {
        const textButton = fixture.debugElement.query(By.css('div a'));
        expect(textButton.nativeElement.innerHTML).toContain('fa-' + iconString);
      });
    });
  });
  describe('on click model', () => {
    initAsync(dummySectionClick, menuService);
    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));
      fixture = TestBed.createComponent(DsoEditMenuSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    describe('when the section model in an on click menu', () => {
      it('should call the activate method when clicking the button', () => {
        spyOn(component, 'activate');

        const button = fixture.debugElement.query(By.css('.btn-dark'));
        button.triggerEventHandler('click', null);

        expect(component.activate).toHaveBeenCalled();
      });
    });
    describe('activate', () => {
      const mockEvent = jasmine.createSpyObj('event', {
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation'),
      });
      it('should call the item model function when not disabled', () => {
        spyOn((component as any).section.model as OnClickMenuItemModel, 'function');
        component.activate(mockEvent);

        expect(((component as any).section.model as OnClickMenuItemModel).function).toHaveBeenCalled();
      });
      it('should call not the item model function when disabled', () => {
        spyOn((component as any).section.model as OnClickMenuItemModel, 'function');
        component.itemModel.disabled = true;
        component.activate(mockEvent);

        expect(((component as any).section.model as OnClickMenuItemModel).function).not.toHaveBeenCalled();
        component.itemModel.disabled = false;
      });
    });

  });

  describe('when the section model in a non disabled link', () => {
    initAsync(dummySectionLink, menuService);
    beforeEach(() => {
      spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));
      fixture = TestBed.createComponent(DsoEditMenuSectionComponent);
      component = fixture.componentInstance;
      spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
      fixture.detectChanges();
    });

    it('should show the link element', () => {
      expect(fixture.debugElement.query(By.css('a'))).not.toBeNull();
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
