import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { MockActivatedRoute } from '@dspace/core/testing/active-router.mock';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { loaderTabs } from '@dspace/core/testing/layout-tab.mocks';
import { RouterMock } from '@dspace/core/testing/router.mock';

import { HostWindowService } from '../../../shared/host-window.service';
import { DynamicLayoutMatrixComponent } from '../../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { DynamicLayoutNavbarComponent } from '../dynamic-layout-horizontal/dynamic-layout-navbar/dynamic-layout-navbar.component';
import { DynamicLayoutSidebarComponent } from './dynamic-layout-sidebar/dynamic-layout-sidebar.component';
import { DynamicLayoutVerticalComponent } from './dynamic-layout-vertical.component';

describe('DynamicLayoutVerticalComponent', () => {
  let component: DynamicLayoutVerticalComponent;
  let fixture: ComponentFixture<DynamicLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLayoutVerticalComponent],
      providers: [
        { provide: HostWindowService, useValue: new HostWindowServiceStub(1200) },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
      ],
    })
      .overrideComponent(DynamicLayoutVerticalComponent, { remove: { imports: [DynamicLayoutSidebarComponent, DynamicLayoutMatrixComponent, DynamicLayoutNavbarComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutVerticalComponent);
    component = fixture.componentInstance;
    component.tabs = loaderTabs;
    component.leadingTabs = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show sidebar', () => {
    expect(fixture.debugElement.query(By.css('ds-dynamic-layout-sidebar'))).toBeTruthy();
  });
});
