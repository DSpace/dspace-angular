import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoPageSubscriptionButtonComponent } from './dso-page-subscription-button.component';

describe('DsoPageSubscriptionButtonComponent', () => {
  let component: DsoPageSubscriptionButtonComponent;
  let fixture: ComponentFixture<DsoPageSubscriptionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsoPageSubscriptionButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoPageSubscriptionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
