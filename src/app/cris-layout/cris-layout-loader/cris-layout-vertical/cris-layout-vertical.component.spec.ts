import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutVerticalComponent } from './cris-layout-vertical.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMock } from '../../../shared/mocks/router.mock';
import { MockActivatedRoute } from '../../../shared/mocks/active-router.mock';
import { By } from '@angular/platform-browser';
import { loaderTabs } from '../../../shared/testing/new-layout-tabs';

describe('CrisLayoutVerticalComponent', () => {
  let component: CrisLayoutVerticalComponent;
  let fixture: ComponentFixture<CrisLayoutVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisLayoutVerticalComponent ],
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
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
