import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, map, startWith, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthService } from '../../../core/auth/auth.service';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription, combineLatest, of, BehaviorSubject } from 'rxjs';
import { getBitstreamDownloadRoute, getForbiddenRoute } from '../../../app-routing-paths';
import { TranslateService } from '@ngx-translate/core';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ItemRequestDataService } from '../../../core/data/item-request-data.service';
import { ItemRequest } from '../../../core/shared/item-request.model';
import { Item } from '../../../core/shared/item.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Location } from '@angular/common';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { getItemPageRoute } from '../../item-page-routing-paths';
import { CookieService } from 'src/app/core/services/cookie.service';
import { CAPTCHA_NAME, GoogleRecaptchaService } from 'src/app/core/google-recaptcha/google-recaptcha.service';


@Component({
  selector: 'ds-bitstream-request-a-copy-page',
  templateUrl: './bitstream-request-a-copy-page.component.html'
})
/**
 * Page component for requesting a copy for a bitstream
 */
export class BitstreamRequestACopyPageComponent implements OnInit, OnDestroy {

  item$: Observable<Item>;

  canDownload$: Observable<boolean>;
  private subs: Subscription[] = [];
  requestCopyForm: UntypedFormGroup;

  item: Item;
  itemName: string;

  bitstream$: Observable<Bitstream>;
  bitstream: Bitstream;
  bitstreamName: string;
  form: UntypedFormGroup;
  /**
   * registration verification configuration
   */
  registrationVerification = false;
  subscriptions: Subscription[] = [];
  /**
 * The message prefix
 */
  @Input()
  MESSAGE_PREFIX: string;
  /**
 * Return true if the user completed the reCaptcha verification (checkbox mode)
 */
  checkboxCheckedSubject$ = new BehaviorSubject<boolean>(false);
  disableUntilChecked = true;
  captchaToken:string;
  captchaVersion(): Observable<string> {
    this.cdRef.detectChanges();
    return this.googleRecaptchaService.captchaVersion();

  }

  captchaMode(): Observable<string> {
    this.cdRef.detectChanges();
    return this.googleRecaptchaService.captchaMode();
  }

  constructor(private location: Location,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    protected router: Router,
    private authorizationService: AuthorizationDataService,
    private auth: AuthService,
    private formBuilder: UntypedFormBuilder,
    private itemRequestDataService: ItemRequestDataService,
    private notificationsService: NotificationsService,
    private dsoNameService: DSONameService,
    private bitstreamService: BitstreamDataService,
    public cookieService: CookieService,
    public googleRecaptchaService: GoogleRecaptchaService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.requestCopyForm = this.formBuilder.group({
      name: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      email: new UntypedFormControl('', {
        validators: [Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]
      }),
      allfiles: new UntypedFormControl(''),
      message: new UntypedFormControl(''),
    });


    this.item$ = this.route.data.pipe(
      map((data) => data.dso),
      getFirstSucceededRemoteDataPayload()
    );

    this.subs.push(this.item$.subscribe((item) => {
      this.item = item;
      this.itemName = this.dsoNameService.getName(item);
    }));

    this.bitstream$ = this.route.queryParams.pipe(
      filter((params) => hasValue(params) && hasValue(params.bitstream)),
      switchMap((params) => this.bitstreamService.findById(params.bitstream)),
      getFirstSucceededRemoteDataPayload()
    );

    this.subs.push(this.bitstream$.subscribe((bitstream) => {
      this.bitstream = bitstream;
      this.bitstreamName = this.dsoNameService.getName(bitstream);
    }));

    this.canDownload$ = this.bitstream$.pipe(
      switchMap((bitstream) => this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(bitstream) ? bitstream.self : undefined))
    );
    const canRequestCopy$ = this.bitstream$.pipe(
      switchMap((bitstream) => this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, isNotEmpty(bitstream) ? bitstream.self : undefined)),
    );

    this.subs.push(observableCombineLatest([this.canDownload$, canRequestCopy$]).subscribe(([canDownload, canRequestCopy]) => {
      if (!canDownload && !canRequestCopy) {
        this.router.navigateByUrl(getForbiddenRoute(), { skipLocationChange: true });
      }
    }));
    this.initValues();

    this.subscriptions.push(this.disableUntilCheckedFcn().subscribe((res) => {
      this.disableUntilChecked = res;
      this.cdRef.detectChanges();
    }));
  }

  get name() {
    return this.requestCopyForm.get('name');
  }

  get email() {
    return this.requestCopyForm.get('email');
  }

  get message() {
    return this.requestCopyForm.get('message');
  }

  get allfiles() {
    return this.requestCopyForm.get('allfiles');
  }

  /**
   * Initialise the form values based on the current user.
   */
  private initValues() {
    this.getCurrentUser().pipe(take(1)).subscribe((user) => {
      this.requestCopyForm.patchValue({ allfiles: 'true' });
      if (hasValue(user)) {
        this.requestCopyForm.patchValue({ name: user.name, email: user.email });
      }
    });
    this.bitstream$.pipe(take(1)).subscribe((bitstream) => {
      this.requestCopyForm.patchValue({ allfiles: 'false' });
    });
  }

  /**
   * Retrieve the current user
   */
  private getCurrentUser(): Observable<EPerson> {
    return this.auth.isAuthenticated().pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return this.auth.getAuthenticatedUserFromStore();
        } else {
          return observableOf(undefined);
        }
      })
    );

  }

  /**
   * Submit the the form values as an item request to the server.
   * When the submission is successful, the user will be redirected to the item page and a success notification will be shown.
   * When the submission fails, the user will stay on the page and an error notification will be shown
   */
  onSubmit() {
    const itemRequest = new ItemRequest();
    if (hasValue(this.bitstream)) {
      itemRequest.bitstreamId = this.bitstream.uuid;
    }
    itemRequest.itemId = this.item.uuid;
    itemRequest.allfiles = this.allfiles.value;
    itemRequest.requestEmail = this.email.value;
    itemRequest.requestName = this.name.value;
    itemRequest.requestMessage = this.message.value;

    this.itemRequestDataService.requestACopy(itemRequest,this.captchaToken).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('bitstream-request-a-copy.submit.success'));
        this.navigateBack();
      } else {
        this.notificationsService.error(this.translateService.get('bitstream-request-a-copy.submit.error'));
      }
    });
  }

  ngOnDestroy(): void {
    if (hasValue(this.subs)) {
      this.subs.forEach((sub) => {
        if (hasValue(sub)) {
          sub.unsubscribe();
        }
      });
    }
  }

  /**
   * Navigates back to the user's previous location
   */
  navigateBack() {
    this.resetForm();
    this.location.back();
  }

  getItemPath() {
    return [getItemPageRoute(this.item)];
  }

  /**
   * Retrieves the link to the bistream download page
   */
  getBitstreamLink() {
    return [getBitstreamDownloadRoute(this.bitstream)];
  }

  /**
   * execute the captcha function for v2 invisible
   */
  executeRecaptcha() {
    this.googleRecaptchaService.executeRecaptcha();
  }

  /**
   * Register an email address
   */
  register(tokenV2?) {
    if (!this.requestCopyForm.invalid) {
      if (!this.registrationVerification) {
        this.subscriptions.push(combineLatest([this.captchaVersion(), this.captchaMode()]).pipe(
          switchMap(([captchaVersion, captchaMode]) => {
            if (captchaVersion === 'v3') {
              return this.googleRecaptchaService.getRecaptchaToken('register_email');
            } else if (captchaVersion === 'v2' && captchaMode === 'checkbox') {
              return of(this.googleRecaptchaService.getRecaptchaTokenResponse());
            } else if (captchaVersion === 'v2' && captchaMode === 'invisible') {
              return of(tokenV2);
            } else {
              console.error(`Invalid reCaptcha configuration: version = ${captchaVersion}, mode = ${captchaMode}`);
              this.showNotification('error');
            }
          }),
          take(1),
        ).subscribe((token) => {
          if (isNotEmpty(token)) {
            // this.onSubmit();
            this.captchaToken = token;
            this.registrationVerification = true;

          } else {
            this.showNotification('error');
          }
        }
        ));
      } else {

        // this.onSubmit();
        this.registrationVerification = true;
      }
    }
  }

  /**
   * Return true if the user has accepted the required cookies for reCaptcha
   */
  isRecaptchaCookieAccepted(): boolean {
    const klaroAnonymousCookie = this.cookieService.get('klaro-anonymous');
    return isNotEmpty(klaroAnonymousCookie) ? klaroAnonymousCookie[CAPTCHA_NAME] : false;
  }

  /**
   * Return true if the user has not completed the reCaptcha verification (checkbox mode)
   */
  disableUntilCheckedFcn(): Observable<boolean> {
    const checked$ = this.checkboxCheckedSubject$.asObservable();
    return combineLatest([this.captchaVersion(), this.captchaMode(), checked$]).pipe(
      // disable if checkbox is not checked or if reCaptcha is not in v2 checkbox mode
      switchMap(([captchaVersion, captchaMode, checked]) => captchaVersion === 'v2' && captchaMode === 'checkbox' ? of(!checked) : of(false)),
      startWith(true),
    );
  }

  onCheckboxChecked(checked: boolean) {
    this.checkboxCheckedSubject$.next(checked);
    if (!!checked) {
      console.log(this.requestCopyForm.invalid);
      if (!this.requestCopyForm.invalid) {
        this.registrationVerification = true;
        this.cdRef.detectChanges();
      }
    }
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

  resetForm() {
    this.requestCopyForm.reset();
  }

  changeCatch() {
    if (!this.requestCopyForm.invalid) {
      this.registrationVerification = true;
      this.cdRef.detectChanges();
    }
  }
}
