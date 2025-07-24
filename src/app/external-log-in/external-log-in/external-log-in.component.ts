import {
  AsyncPipe,
  NgComponentOutlet,
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
import {
  from,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { AuthMethodsService } from '../../core/auth/auth-methods.service';
import { AuthMethodType } from '../../core/auth/models/auth.method-type';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { Registration } from '../../core/shared/registration.model';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';
import { ThemedLogInComponent } from '../../shared/log-in/themed-log-in.component';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { getExternalLoginConfirmationType } from '../decorators/external-log-in.methods-decorator';
import { ConfirmEmailComponent } from '../email-confirmation/confirm-email/confirm-email.component';
import { ProvideEmailComponent } from '../email-confirmation/provide-email/provide-email.component';

@Component({
  selector: 'ds-external-log-in',
  templateUrl: './external-log-in.component.html',
  styleUrls: ['./external-log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    AsyncPipe,
    ConfirmEmailComponent,
    NgComponentOutlet,
    ProvideEmailComponent,
    ThemedLogInComponent,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * This component is responsible to handle the external-login depending on the RegistrationData details provided
 */
export class ExternalLogInComponent implements OnInit, OnDestroy {
  /**
   * The AlertType enumeration for access in the component's template
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * The type of registration type to be confirmed
   */
  registrationType: AuthRegistrationType;
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
   * The observable to check if any auth method type is configured
   */
  hasAuthMethodTypes$: Observable<boolean>;

  /**
   * The dynamic component that should be rendered
   */
  externalLoginConfirmationComponent$: Observable<GenericConstructor<Component>>;

  constructor(
    protected injector: Injector,
    protected translate: TranslateService,
    protected modalService: NgbModal,
    protected authService: AuthService,
    protected authMethodsService: AuthMethodsService,
    protected themeService: ThemeService,
  ) {
  }

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
    this.relatedAuthMethod = isEmpty(this.registrationType) ? null :
      this.registrationType.replace('VALIDATION_', '').toLocaleLowerCase() as AuthMethodType;
    this.informationText = hasValue(this.registrationData?.email)
      ? this.generateInformationTextWhenEmail(this.registrationType)
      : this.generateInformationTextWhenNOEmail(this.registrationType);
    this.hasAuthMethodTypes$ = this.authMethodsService.getAuthMethods(this.relatedAuthMethod).pipe(
      map(methods => methods.length > 0),
    );
    this.externalLoginConfirmationComponent$ = this.getExternalLoginConfirmationType();
  }

  /**
   * Get the registration type to be rendered
   */
  getExternalLoginConfirmationType(): Observable<GenericConstructor<Component>> {
    return from(getExternalLoginConfirmationType(this.registrationType, this.themeService.getThemeName()));
  }

  /**
   * Opens the login modal and sets the redirect URL to '/review-account'.
   * On modal dismissed/closed, the redirect URL is cleared.
   * @param content - The content to be displayed in the modal.
   */
  openLoginModal(content: any) {
    this.modalRef = this.modalService.open(content);
    this.authService.setRedirectUrl(`/review-account/${this.token}`);
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
}
