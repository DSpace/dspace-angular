import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';

/**
 * A GoogleRecaptchaService used to send action and get a token from REST
 */
@Injectable()
export class GoogleRecaptchaService {

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  /**
   * Returns an observable of string
   * @param action action is the process type in which used to protect multiple spam REST calls
   */
  public getRecaptchaToken (action) {
    return this.recaptchaV3Service.execute(action);
  }

}
