import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';

describe('ExternalLoginReviewAccountInfoPageComponent', () => {
  let component: ExternalLoginReviewAccountInfoPageComponent;
  let fixture: ComponentFixture<ExternalLoginReviewAccountInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginReviewAccountInfoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginReviewAccountInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
