import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthRegistrationType } from '../../../core/auth/models/auth.registration-type';
import { Registration } from '../../../core/shared/registration.model';
import { renderExternalLoginConfirmationFor } from '../../decorators/external-log-in.methods-decorator';
import { ExternalLoginMethodEntryComponent } from '../../decorators/external-login-method-entry.component';

@Component({
  selector: 'ds-orcid-confirmation',
  templateUrl: './orcid-confirmation.component.html',
  styleUrls: ['./orcid-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@renderExternalLoginConfirmationFor(AuthRegistrationType.Orcid)
export class OrcidConfirmationComponent extends ExternalLoginMethodEntryComponent implements OnInit  {

  /**
   * The form containing the user's data
   */
  public form: FormGroup;

  /**
   * @param injectedRegistrationDataObject Registration object provided
   * @param formBuilder To build the form
   */
  constructor(
    @Inject('registrationDataProvider') protected injectedRegistrationDataObject: Registration,
    private formBuilder: FormBuilder
  ) {
    super(injectedRegistrationDataObject);
  }

  /**
   * Initialize the form with disabled fields
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      netId: [{ value: this.registratioData.netId, disabled: true }],
      firstname: [{ value: this.getFirstname(), disabled: true }],
      lastname: [{ value: this.getLastname(), disabled: true }],
      email: [{ value: this.registratioData?.email || '', disabled: true }], // email can be null
    });
  }

  /**
   * Get the firstname of the user from the registration metadata
   * @returns the firstname of the user
   */
  private getFirstname(): string {
    return this.registratioData.registrationMetadata?.['eperson.firstname']?.[0]?.value || '';
  }

  /**
   * Get the lastname of the user from the registration metadata
   * @returns the lastname of the user
   */
  private getLastname(): string {
    return this.registratioData.registrationMetadata?.['eperson.lastname']?.[0]?.value || '';
  }
}
