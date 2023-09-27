import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalLoginService } from '../../services/external-login.service';
import { getRemoteDataPayload } from '../../../../core/shared/operators';

@Component({
  selector: 'ds-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmEmailComponent {

  emailForm: FormGroup;

  @Input() registrationId: string;

  @Input() token: string;

  constructor(
    private formBuilder: FormBuilder,
    private externalLoginService: ExternalLoginService,
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    this.emailForm.markAllAsTouched();
    if (this.emailForm.valid) {
      const email = this.emailForm.get('email').value;
      this.externalLoginService.patchUpdateRegistration([email], 'email', this.registrationId, this.token, 'replace')
        .pipe(getRemoteDataPayload())
        .subscribe((update) => {
          console.log('Email update:', update);
        });
    }
  }
}
