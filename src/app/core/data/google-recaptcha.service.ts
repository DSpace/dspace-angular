import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Injectable()
export class GoogleRecaptchaService {

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  public getRecaptchaToken (action) {
    return this.recaptchaV3Service.execute(action);
  }

}
