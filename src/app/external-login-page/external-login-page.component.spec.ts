import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginPageComponent } from './external-login-page.component';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { Router } from '@angular/router';
import { RouterMock } from '../shared/mocks/router.mock';

describe('ExternalLoginPageComponent', () => {
  let component: ExternalLoginPageComponent;
  let fixture: ComponentFixture<ExternalLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginPageComponent ],
      providers: [
        { provide: EpersonRegistrationService, useValue: {} },
        { provide: Router, useValue: new RouterMock() },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
