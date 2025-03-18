import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { Feedback } from 'src/app/core/feedback/models/feedback.model';

import { getHomePageRoute } from '../../../app-routing-paths';
import { AuthService } from '../../../core/auth/auth.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { FeedbackDataService } from '../../../core/feedback/feedback-data.service';
import {
  CAPTCHA_NAME,
  GoogleRecaptchaService,
} from '../../../core/google-recaptcha/google-recaptcha.service';
import { CookieService } from '../../../core/services/cookie.service';
import { RouteService } from '../../../core/services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../core/services/window.service';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../core/shared/operators';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { OrejimeService } from '../../../shared/cookies/orejime.service';
import { isNotEmpty } from '../../../shared/empty.util';
import { ErrorComponent } from '../../../shared/error/error.component';
import { GoogleRecaptchaComponent } from '../../../shared/google-recaptcha/google-recaptcha.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-base-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, ErrorComponent, TranslateModule,AlertComponent, AsyncPipe, GoogleRecaptchaComponent, BtnDisabledDirective],
})
/**
 * Component displaying the contents of the Feedback Statement
 */
export class FeedbackFormComponent implements OnInit,OnDestroy {

  protected readonly AlertTypeEnum = AlertType;

  /**
   * Form builder created used from the feedback from
   */
  feedbackForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    message: ['', Validators.required],
    page: [''],
  });
  MESSAGE_PREFIX = 'info.feedback';
  subscriptions: Subscription[] = [];

  /**
   * Return true if the user completed the reCaptcha verification (checkbox mode)
   */
  checkboxCheckedSubject$ = new BehaviorSubject<boolean>(false);
  disableUntilChecked = true;


  registrationVerification = false;

  captchaVersion(): Observable<string> {
    return this.googleRecaptchaService.captchaVersion();
  }

  captchaMode(): Observable<string> {
    return this.googleRecaptchaService.captchaMode();
  }



  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    public routeService: RouteService,
    private fb: UntypedFormBuilder,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    private feedbackDataService: FeedbackDataService,
    private authService: AuthService,
    public googleRecaptchaService: GoogleRecaptchaService,
    public cookieService: CookieService,
    @Optional() public orejimeService: OrejimeService,
    private configService: ConfigurationDataService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router) {
  }

  /**
   * On init check if user is logged in and use its email if so
   */
  ngOnInit() {

    this.authService.getAuthenticatedUserFromStore().pipe(take(1)).subscribe((user: EPerson) => {
      if (user) {
        this.feedbackForm.patchValue({ email: user.email });
      }
    });

    this.routeService.getPreviousUrl().pipe(take(1)).subscribe((url: string) => {
      if (!url) {
        url = getHomePageRoute();
      }
      const relatedUrl = new URLCombiner(this._window.nativeWindow.origin, url).toString();
      this.feedbackForm.patchValue({ page: relatedUrl });
    });
    this.subscriptions.push(this.configService.findByPropertyName('feedback.verification.enabled').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((res: ConfigurationProperty) => res?.values[0].toLowerCase() === 'true'),
    ).subscribe((res: boolean) => {
      this.registrationVerification = res;
    }));
    this.subscriptions.push(this.disableUntilCheckedFcn().subscribe((res) => {
      this.disableUntilChecked = res;
      this.changeDetectorRef.detectChanges();
    }));

  }

  /**
   * Function to create the feedback from form values
   */
  createFeedback(token: string = null): Observable<RemoteData<Feedback>> {
    return this.feedbackDataService.registerFeedback(this.feedbackForm.value,token).pipe(getFirstCompletedRemoteData());
  }


  /**
   * Return true if the user has accepted the required cookies for reCaptcha
   */
  isRecaptchaCookieAccepted(): boolean {
    const klaroAnonymousCookie = this.cookieService.get('orejime-anonymous');
    return isNotEmpty(klaroAnonymousCookie) ? klaroAnonymousCookie[CAPTCHA_NAME] : false;
  }

  /**
   * Verify and send feedback
   */
  send(tokenV2?: string) {
    let tokenObservable: Observable<string>;
    if (this.registrationVerification) {
      tokenObservable = combineLatest([this.captchaVersion(), this.captchaMode()]).pipe(
        switchMap(([captchaVersion, captchaMode]) => {
          if (captchaVersion === 'v3') {
            return this.googleRecaptchaService.getRecaptchaToken('feedback');
          } else if (captchaVersion === 'v2' && captchaMode === 'checkbox') {
            return this.googleRecaptchaService.getRecaptchaTokenResponse();
          } else if (captchaVersion === 'v2' && captchaMode === 'invisible') {
            return tokenV2;
          } else {
            this.notificationsService.error(this.translate.instant('info.feedback.create.error'));
            return EMPTY;
          }
        }),
        filter(token => isNotEmpty(token)),
        take(1),
      );
    } else {
      tokenObservable = of(null);
    }
    tokenObservable.subscribe(token => {
      this.createFeedback(token).subscribe((response: RemoteData<NoContent>) => {
        const url = this.feedbackForm.value.page.replace(this._window.nativeWindow.origin, '');
        if (response.isSuccess) {
          this.notificationsService.success(this.translate.instant('info.feedback.create.success'));
          this.router.navigate(url);
        } else {
          this.notificationsService.error(this.translate.instant('info.feedback.create.error'));
        }
      });
    });
  }

  /**
   * Show a notification to the user
   * @param key
   */
  showNotification(key) {
    const notificationTitle = this.translateService.get(this.MESSAGE_PREFIX + '.google-recaptcha.notification.title');
    const notificationErrorMsg = this.translateService.get(this.MESSAGE_PREFIX + '.google-recaptcha.notification.message.error');
    const notificationExpiredMsg = this.translateService.get(this.MESSAGE_PREFIX + '.google-recaptcha.notification.message.expired');
    switch (key) {
      case 'expired':
        this.notificationsService.warning(notificationTitle, notificationExpiredMsg);
        break;
      case 'error':
        this.notificationsService.error(notificationTitle, notificationErrorMsg);
        break;
      default:
        console.warn(`Unimplemented notification '${key}' from reCaptcha service`);
    }
  }

  onCheckboxChecked(checked: boolean) {
    this.checkboxCheckedSubject$.next(checked);
  }

  /**
   * Return true if the user has not completed the reCaptcha verification (checkbox mode)
   */
  disableUntilCheckedFcn(): Observable<boolean> {
    const checked$ = this.checkboxCheckedSubject$.asObservable();
    return combineLatest([this.captchaVersion(), this.captchaMode(), checked$]).pipe(
      // disable if checkbox is not checked or if reCaptcha is not in v2 checkbox mode
      switchMap(([captchaVersion, captchaMode, checked])  => captchaVersion === 'v2' && captchaMode === 'checkbox' ? of(!checked) : of(false)),
      startWith(true),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**
   * execute the captcha function for v2 invisible
   */
  executeRecaptcha() {
    this.googleRecaptchaService.executeRecaptcha();
  }
}
