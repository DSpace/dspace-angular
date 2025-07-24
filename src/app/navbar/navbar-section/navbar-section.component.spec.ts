import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../../shared/testing/menu-service.stub';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { NavbarSectionComponent } from './navbar-section.component';

describe('NavbarSectionComponent', () => {
  let component: NavbarSectionComponent;
  let fixture: ComponentFixture<NavbarSectionComponent>;
  const menuService = new MenuServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NavbarSectionComponent, TestComponent],
      providers: [
        { provide: MenuService, useValue: menuService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));

    fixture = TestBed.createComponent(NavbarSectionComponent);
    component = fixture.componentInstance;
    component.section = {} as MenuSection;
    spyOn(component, 'getMenuItemComponent').and.returnValue(Promise.resolve(TestComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
