import { Inject } from '@angular/core';

import { Registration } from '../../core/shared/registration.model';

/**
 * This component renders  a form to complete the registration process
 */
export abstract class ExternalLoginMethodEntryComponent {

  /**
   * The registration data object
   */
  public registrationData: Registration;

  protected constructor(
    @Inject('registrationDataProvider') protected injectedRegistrationDataObject: Registration,
  ) {
    this.registrationData = injectedRegistrationDataObject;
  }
}
