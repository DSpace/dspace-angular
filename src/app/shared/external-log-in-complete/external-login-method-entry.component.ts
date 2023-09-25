import { Component, Inject } from '@angular/core';
import { RegistrationData } from './models/registration-data.model';

/**
 * This component renders  a form to complete the registration process
 */
@Component({
  template: ''
})
export abstract class ExternalLoginMethodEntryComponent {

  /**
   * The registration data object
   */
  public registratioData: RegistrationData;

  constructor(
    @Inject('registrationDataProvider') protected injectedRegistrationDataObject: RegistrationData,
  ) {
    this.registratioData = injectedRegistrationDataObject;
  }
}
