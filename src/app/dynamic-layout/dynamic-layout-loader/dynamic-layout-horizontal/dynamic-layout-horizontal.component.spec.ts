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
import { loaderTabs } from '@dspace/core/testing/layout-tab.mocks';
import { RouterMock } from '@dspace/core/testing/router.mock';

import { DynamicLayoutMatrixComponent } from '../../dynamic-layout-matrix/dynamic-layout-matrix.component';
import { DynamicLayoutHorizontalComponent } from './dynamic-layout-horizontal.component';
import { DynamicLayoutNavbarComponent } from './dynamic-layout-navbar/dynamic-layout-navbar.component';

describe('DynamicLayoutHorizontalComponent', () => {
  let component: DynamicLayoutHorizontalComponent;
  let fixture: ComponentFixture<DynamicLayoutHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLayoutHorizontalComponent],
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
      ],
    })
      .overrideComponent(DynamicLayoutHorizontalComponent, { remove: { imports: [DynamicLayoutNavbarComponent, DynamicLayoutMatrixComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutHorizontalComponent);
    component = fixture.componentInstance;
    component.leadingTabs = [];
    component.tabs = loaderTabs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show navbar', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-dynamic-layout-navbar'))).toBeTruthy();
  });
});
