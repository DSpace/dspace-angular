import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AltchaCaptchaComponent } from './altcha-captcha.component';

describe('AltchaCaptchaComponent', () => {
  let component: AltchaCaptchaComponent;
  let fixture: ComponentFixture<AltchaCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AltchaCaptchaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AltchaCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should emit payload when verification is successful', () => {
    const testPayload = 'test-payload';
    const payloadSpy = jasmine.createSpy('payloadSpy');
    component.payload.subscribe(payloadSpy);

    const event = new CustomEvent('statechange', {
      detail: {
        state: 'verified',
        payload: testPayload,
      },
    });

    document.querySelector('#altcha-widget').dispatchEvent(event);

    expect(payloadSpy).toHaveBeenCalledWith(testPayload);
  });
});
