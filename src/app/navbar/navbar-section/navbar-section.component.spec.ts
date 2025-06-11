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
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { MenuServiceStub } from '../../shared/testing/menu-service.stub';
import { NavbarSectionComponent } from './navbar-section.component';

describe('NavbarSectionComponent', () => {
  let component: NavbarSectionComponent;
  let fixture: ComponentFixture<NavbarSectionComponent>;
  const menuService = new MenuServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NavbarSectionComponent, TestComponent],
      providers: [
        { provide: 'sectionDataProvider', useValue: {} },
        { provide: MenuService, useValue: menuService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(menuService, 'getSubSectionsByParentID').and.returnValue(of([]));

    fixture = TestBed.createComponent(NavbarSectionComponent);
    component = fixture.componentInstance;
    spyOn(component as any, 'getMenuItemComponent').and.returnValue(TestComponent);
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
