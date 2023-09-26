import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Injector,
} from '@angular/core';
import { getExternalLoginConfirmationType } from '../external-log-in.methods-decorator';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { RegistrationData } from '../models/registration-data.model';
import { hasValue } from '../../empty.util';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ds-external-log-in',
  templateUrl: './external-log-in.component.html',
  styleUrls: ['./external-log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalLogInComponent implements OnInit {
  /**
   * The type of registration type to be confirmed
   */
  registrationType: AuthMethodType;
  /**
   * The registration data object
   */
  @Input() registrationData: RegistrationData;
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

  constructor(
    private injector: Injector,
    private translate: TranslateService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {
    // if user is logged in, redirect to home page
    // in case user logs in with an existing account
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
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
        { authMethod: authMethodUppercase }
      );
    }
  }

  /**
   * Get the registration type to be rendered
   */
  getExternalLoginConfirmationType() {
    return getExternalLoginConfirmationType(this.registrationType);
  }

  openLoginModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  ngOnDestroy(): void {
    this.modalRef?.close();
  }
}
