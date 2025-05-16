import {
  AsyncPipe,
  Location,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  getBitstreamDownloadRoute,
  getForbiddenRoute,
} from '../../../app-routing-paths';
import { AuthService } from '../../../core/auth/auth.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ItemRequestDataService } from '../../../core/data/item-request-data.service';
import { ProofOfWorkCaptchaDataService } from '../../../core/data/proof-of-work-captcha-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Item } from '../../../core/shared/item.model';
import { ItemRequest } from '../../../core/shared/item-request.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../core/shared/operators';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { getItemPageRoute } from '../../item-page-routing-paths';
import { AltchaCaptchaComponent } from './altcha-captcha.component';

@Component({
  selector: 'ds-bitstream-request-a-copy-page',
  templateUrl: './bitstream-request-a-copy-page.component.html',
  imports: [
    AltchaCaptchaComponent,
    AsyncPipe,
    BtnDisabledDirective,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
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

  // Captcha settings
  captchaEnabled$: Observable<boolean>;
  challengeHref$: Observable<string>;

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
              private captchaService: ProofOfWorkCaptchaDataService,
              private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.requestCopyForm = this.formBuilder.group({
      name: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
      email: new UntypedFormControl('', {
        validators: [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
      }),
      allfiles: new UntypedFormControl(''),
      message: new UntypedFormControl(''),
      // Payload here is initialised as "required", but this validator will be cleared
      // if the config property comes back as 'captcha not enabled'
      captchaPayload: new UntypedFormControl('', {
        validators: [Validators.required],
      }),
    });

    this.captchaEnabled$ = this.itemRequestDataService.isProtectedByCaptcha();
    this.challengeHref$ = this.captchaService.getChallengeHref();

    this.item$ = this.route.data.pipe(
      map((data) => data.dso),
      getFirstSucceededRemoteDataPayload(),
    );

    this.subs.push(this.item$.subscribe((item) => {
      this.item = item;
      this.itemName = this.dsoNameService.getName(item);
    }));

    this.bitstream$ = this.route.queryParams.pipe(
      filter((params) => hasValue(params) && hasValue(params.bitstream)),
      switchMap((params) => this.bitstreamService.findById(params.bitstream)),
      getFirstSucceededRemoteDataPayload(),
    );

    this.subs.push(this.bitstream$.subscribe((bitstream) => {
      this.bitstream = bitstream;
      this.bitstreamName = this.dsoNameService.getName(bitstream);
    }));

    this.canDownload$ = this.bitstream$.pipe(
      switchMap((bitstream) => this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(bitstream) ? bitstream.self : undefined)),
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

  get captchaPayload() {
    return this.requestCopyForm.get('captchaPayload');
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
    this.subs.push(this.captchaEnabled$.pipe(
      take(1),
    ).subscribe((enabled) => {
      if (!enabled) {
        // Captcha not required? Clear validators to allow the form to be submitted normally
        this.requestCopyForm.get('captchaPayload').clearValidators();
        this.requestCopyForm.get('captchaPayload').reset();
        this.requestCopyForm.updateValueAndValidity();
      }
      this.changeDetectorRef.detectChanges();
    }));
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
          return of(undefined);
        }
      }),
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
    const captchaPayloadString: string = this.captchaPayload.value;

    this.itemRequestDataService.requestACopy(itemRequest, captchaPayloadString).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('bitstream-request-a-copy.submit.success'));
        this.navigateBack();
      } else {
        this.notificationsService.error(this.translateService.get('bitstream-request-a-copy.submit.error'));
      }
    });
  }

  handlePayload(event): void {
    this.requestCopyForm.patchValue({ captchaPayload: event });
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
    this.location.back();
  }

  getItemPath() {
    return [getItemPageRoute(this.item)];
  }

  /**
   * Retrieves the link to the bitstream download page
   */
  getBitstreamLink() {
    return [getBitstreamDownloadRoute(this.bitstream)];
  }
}
