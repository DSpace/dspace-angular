import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutVerticalComponent } from './cris-layout-vertical.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMock } from '../../../shared/mocks/router.mock';
import { MockActivatedRoute } from '../../../shared/mocks/active-router.mock';
import { By } from '@angular/platform-browser';
import { loaderTabs } from '../../../shared/testing/new-layout-tabs';
import { HostWindowService } from '../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';

describe('CrisLayoutVerticalComponent', () => {
  let component: CrisLayoutVerticalComponent;
  let fixture: ComponentFixture<CrisLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutVerticalComponent ],
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(1200) },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show sidebar', () => {
    component.tabs = loaderTabs;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-cris-layout-sidebar'))).toBeTruthy();
  });
});
