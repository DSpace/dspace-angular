import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';

describe('ExternalLoginEmailConfirmationPageComponent', () => {
  let component: ExternalLoginEmailConfirmationPageComponent;
  let fixture: ComponentFixture<ExternalLoginEmailConfirmationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginEmailConfirmationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginEmailConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
