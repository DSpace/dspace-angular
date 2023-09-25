import { Component, Inject } from '@angular/core';
import { Registration } from '../../core/shared/registration.model';

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
  public registratioData: Registration;

  constructor(
    @Inject('registrationDataProvider') protected injectedRegistrationDataObject: Registration,
  ) {
    this.registratioData = injectedRegistrationDataObject;
  }
}
