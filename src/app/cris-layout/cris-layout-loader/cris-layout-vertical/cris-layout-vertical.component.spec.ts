import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutVerticalComponent } from './cris-layout-vertical.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMock } from '../../../shared/mocks/router.mock';
import { MockActivatedRoute } from '../../../shared/mocks/active-router.mock';
import { By } from '@angular/platform-browser';
import { HostWindowService } from '../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { loaderTabs } from '../../../shared/testing/layout-tab.mocks';
import { SharedModule } from 'src/app/shared/shared.module';

describe('CrisLayoutVerticalComponent', () => {
  let component: CrisLayoutVerticalComponent;
  let fixture: ComponentFixture<CrisLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrisLayoutVerticalComponent],
      providers: [
        { provide: HostWindowService, useValue: new HostWindowServiceStub(1200) },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
      ],
      imports: [
        SharedModule,
      ]
    })
      .compileComponents();
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
