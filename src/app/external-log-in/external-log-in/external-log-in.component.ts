import {
  NgComponentOutlet,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { AuthService } from '../../core/auth/auth.service';
import { AuthMethodType } from '../../core/auth/models/auth.method-type';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { Registration } from '../../core/shared/registration.model';
import { AlertComponent } from '../../shared/alert/alert.component';
import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';
import { ThemedLogInComponent } from '../../shared/log-in/themed-log-in.component';
import { getExternalLoginConfirmationType } from '../decorators/external-log-in.methods-decorator';
import { ConfirmEmailComponent } from '../email-confirmation/confirm-email/confirm-email.component';
import { ProvideEmailComponent } from '../email-confirmation/provide-email/provide-email.component';

@Component({
  selector: 'ds-external-log-in',
  templateUrl: './external-log-in.component.html',
  styleUrls: ['./external-log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslateModule,
    NgComponentOutlet,
    AlertComponent,
    NgIf,
    ThemedLogInComponent,
    ConfirmEmailComponent,
    ProvideEmailComponent,
  ],
})
export class ExternalLogInComponent implements OnInit, OnDestroy {

  /**
   * The registration data object
   */
  @Input() registrationData: Registration;
  /**
   * The token to be used to confirm the registration
   * @memberof ExternalLogInComponent
   */
  @Input() token: string;
  /**
   * The information text to be displayed,
   * depending on the registration type and the presence of an email
   * @memberof ExternalLogInComponent
   */
  public informationText = '';
  /**
   * Injector to inject a registration data to the component with the @Input registrationType
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * Authentication method related to registration type
   */
  relatedAuthMethod: AuthMethodType;

  /**
   * The type of registration type to be confirmed
   */
  registrationType: AuthRegistrationType;

  constructor(
    private injector: Injector,
    private translate: TranslateService,
    private modalService: NgbModal,
    private authService: AuthService,
  ) { }

  /**
   * Provide the registration data object to the objectInjector.
   * Generate the information text to be displayed.
   */
  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        {
          provide: 'registrationDataProvider',
          useFactory: () => this.registrationData,
          deps: [],
        },
      ],
      parent: this.injector,
    });
    this.registrationType = this.registrationData?.registrationType ?? null;
    this.relatedAuthMethod = isEmpty(this.registrationType) ? null : this.registrationType.replace('VALIDATION_', '').toLocaleLowerCase() as AuthMethodType;
    this.informationText = hasValue(this.registrationData?.email)
      ? this.generateInformationTextWhenEmail(this.registrationType)
      : this.generateInformationTextWhenNOEmail(this.registrationType);
  }

  /**
   * Generate the information text to be displayed when the user has no email
   * @param authMethod the registration type
   */
  private generateInformationTextWhenNOEmail(authMethod: string): string {
    if (authMethod) {
      const authMethodUppercase = authMethod.toUpperCase();
      return this.translate.instant('external-login.noEmail.informationText', {
        authMethod: authMethodUppercase,
      });
    }
  }

  /**
   * Generate the information text to be displayed when the user has an email
   * @param authMethod the registration type
   */
  private generateInformationTextWhenEmail(authMethod: string): string {
    if (authMethod) {
      const authMethodUppercase = authMethod.toUpperCase();
      return this.translate.instant(
        'external-login.haveEmail.informationText',
        { authMethod: authMethodUppercase },
      );
    }
  }

  /**
   * Get the registration type to be rendered
   */
  getExternalLoginConfirmationType() {
    return getExternalLoginConfirmationType(this.registrationType);
  }

  /**
   * Opens the login modal and sets the redirect URL to '/review-account'.
   * On modal dismissed/closed, the redirect URL is cleared.
   * @param content - The content to be displayed in the modal.
   */
  openLoginModal(content: any) {
    setTimeout(() => {
      this.authService.setRedirectUrl(`/review-account/${this.token}`);
    }, 100);
    this.modalRef = this.modalService.open(content);

    this.modalRef.dismissed.subscribe(() => {
      this.clearRedirectUrl();
    });
  }

  /**
   * Clears the redirect URL stored in the authentication service.
   */
  clearRedirectUrl() {
    this.authService.clearRedirectUrl();
  }

  ngOnDestroy(): void {
    this.modalRef?.close();
  }
}
