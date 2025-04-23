import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Registration } from '../../../core/shared/registration.model';
import { BrowserOnlyPipe } from '../../../shared/utils/browser-only.pipe';
import { ExternalLoginMethodEntryComponent } from '../../decorators/external-login-method-entry.component';

@Component({
  selector: 'ds-orcid-confirmation',
  templateUrl: './orcid-confirmation.component.html',
  styleUrls: ['./orcid-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BrowserOnlyPipe,
    ReactiveFormsModule,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * This component is responsible to show the registered data inside the registration token to the user
 */
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
    private formBuilder: FormBuilder,
  ) {
    super(injectedRegistrationDataObject);
  }

  /**
   * Initialize the form with disabled fields
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      netId: [{ value: this.registrationData.netId, disabled: true }],
      firstname: [{ value: this.getFirstname(), disabled: true }],
      lastname: [{ value: this.getLastname(), disabled: true }],
      email: [{ value: this.registrationData?.email || '', disabled: true }], // email can be null
    });
  }

  /**
   * Get the firstname of the user from the registration metadata
   * @returns the firstname of the user
   */
  private getFirstname(): string {
    return this.registrationData.registrationMetadata?.['eperson.firstname']?.[0]?.value || '';
  }

  /**
   * Get the lastname of the user from the registration metadata
   * @returns the lastname of the user
   */
  private getLastname(): string {
    return this.registrationData.registrationMetadata?.['eperson.lastname']?.[0]?.value || '';
  }
}
