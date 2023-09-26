import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginValidationPageComponent } from './external-login-validation-page.component';

describe('ExternalLoginValidationPageComponent', () => {
  let component: ExternalLoginValidationPageComponent;
  let fixture: ComponentFixture<ExternalLoginValidationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginValidationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginValidationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
