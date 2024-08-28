import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { ContextMenuComponent } from '../../../shared/context-menu/context-menu.component';
import { HostWindowService } from '../../../shared/host-window.service';
import { MockActivatedRoute } from '../../../shared/mocks/active-router.mock';
import { RouterMock } from '../../../shared/mocks/router.mock';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { loaderTabs } from '../../../shared/testing/layout-tab.mocks';
import { CrisLayoutMatrixComponent } from '../../cris-layout-matrix/cris-layout-matrix.component';
import { CrisLayoutNavbarComponent } from '../cris-layout-horizontal/cris-layout-navbar/cris-layout-navbar.component';
import { CrisLayoutSidebarComponent } from './cris-layout-sidebar/cris-layout-sidebar.component';
import { CrisLayoutVerticalComponent } from './cris-layout-vertical.component';

describe('CrisLayoutVerticalComponent', () => {
  let component: CrisLayoutVerticalComponent;
  let fixture: ComponentFixture<CrisLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisLayoutVerticalComponent],
      providers: [
        { provide: HostWindowService, useValue: new HostWindowServiceStub(1200) },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
      ],
    })
      .overrideComponent(CrisLayoutVerticalComponent, { remove: { imports: [CrisLayoutSidebarComponent, ContextMenuComponent, CrisLayoutMatrixComponent, CrisLayoutNavbarComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutVerticalComponent);
    component = fixture.componentInstance;
    component.tabs = loaderTabs;
    component.leadingTabs = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show sidebar', () => {
    expect(fixture.debugElement.query(By.css('ds-cris-layout-sidebar'))).toBeTruthy();
  });
});
