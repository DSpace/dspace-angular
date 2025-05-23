import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import {
  combineLatest,
  filter,
  from,
  map,
  Observable,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { RemoteData } from '../../core/data/remote-data';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../core/services/window.service';
import { Registration } from '../../core/shared/registration.model';
import { ExternalLoginService } from '../../external-log-in/services/external-login.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CompareValuesPipe } from '../helpers/compare-values.pipe';

export interface ReviewAccountInfoData {
  label: string;
  currentValue: string;
  receivedValue: string;
  overrideValue: boolean;
  identifier: string;
}

@Component({
  selector: 'ds-review-account-info',
  templateUrl: './review-account-info.component.html',
  styleUrls: ['./review-account-info.component.scss'],
  imports: [
    AlertComponent,
    CompareValuesPipe,
    TitleCasePipe,
    TranslateModule,
    UiSwitchModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
/**
 * This component shows up the difference between the current account details and the one provided by the
 * Registration data.
 */
export class ReviewAccountInfoComponent implements OnInit, OnDestroy {
  /**
   * The AlertType enumeration for access in the component's template
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
  /**
   * The registration token sent from validation link
   */
  @Input() registrationToken: string;
  /**
   * User data from the registration token
   */
  @Input() registrationData: Registration;

  /**
   * List of data to compare
   */
  dataToCompare: ReviewAccountInfoData[] = [];
  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private ePersonService: EPersonDataService,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private externalLoginService: ExternalLoginService,
    private hardRedirectService: HardRedirectService,
  ) { }

  ngOnInit(): void {
    this.dataToCompare = this.prepareDataToCompare();
  }

  /**
   * Find the data to compare based on the metadata key and update the override value
   * @param value value of the override checkbox
   * @param identifier the metadata key
   */
  public onOverrideChange(value: boolean, identifier: string) {
    this.dataToCompare.find(
      (data) => data.identifier === identifier,
    ).overrideValue = value;
  }

  /**
   * Open a confirmation modal to confirm the override of the data
   * If confirmed, merge the data from the registration token with the data from the eperson.
   * There are 2 cases:
   * -> If the user is authenticated, merge the data and redirect to profile page.
   * -> If the user is not authenticated, combine the override$, external auth location and redirect URL observables.
   */
  public onSave() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.headerLabel =
      'confirmation-modal.review-account-info.header';
    modalRef.componentInstance.infoLabel =
      'confirmation-modal.review-account-info.info';
    modalRef.componentInstance.cancelLabel =
      'confirmation-modal.review-account-info.cancel';
    modalRef.componentInstance.confirmLabel =
      'confirmation-modal.review-account-info.confirm';
    modalRef.componentInstance.brandColor = 'primary';
    modalRef.componentInstance.confirmIcon = 'fa fa-check';

    if (!this.registrationData.user) {
      this.subs.push(
        this.isAuthenticated()
          .pipe(
            filter((isAuthenticated) => isAuthenticated),
            switchMap(() => this.authService.getAuthenticatedUserFromStore()),
            filter((user) => hasValue(user)),
            map((user) => user.uuid),
            switchMap((userId) =>
              modalRef.componentInstance.response.pipe(
                tap((confirm: boolean) => {
                  if (confirm) {
                    this.mergeEPersonDataWithToken(userId, this.registrationData.registrationType);
                  }
                }),
              ),
            ),
          )
          .subscribe(),
      );
    } else if (this.registrationData.user) {
      this.subs.push(
        modalRef.componentInstance.response
          .pipe(take(1))
          .subscribe((confirm: boolean) => {
            if (confirm && this.registrationData.user) {
              const registrationType = this.registrationData.registrationType.split(AuthRegistrationType.Validation)[1];
              this.mergeEPersonDataWithToken(this.registrationData.user, registrationType);
            }
          }),
      );
    }
  }

  /**
   * Merge the data from the registration token with the data from the eperson.
   * If any of the metadata is overridden, sent a merge request for each metadata to override.
   * If none of the metadata is overridden, sent a merge request with the registration token only.
   */
  mergeEPersonDataWithToken(userId: string, registrationType: string) {
    let override$: Observable<RemoteData<EPerson>>;
    if (this.dataToCompare.some((d) => d.overrideValue)) {
      override$ = from(this.dataToCompare).pipe(
        filter((data: ReviewAccountInfoData) => data.overrideValue),
        switchMap((data: ReviewAccountInfoData) => {
          return this.ePersonService.mergeEPersonDataWithToken(
            userId,
            this.registrationToken,
            data.identifier,
          );
        }),
      );
    } else {
      override$ = this.ePersonService.mergeEPersonDataWithToken(
        userId,
        this.registrationToken,
      );
    }
    if (this.registrationData.user && this.registrationData.registrationType.includes(AuthRegistrationType.Validation)) {
      this.handleUnauthenticatedUser(override$, registrationType);
    } else {
      this.handleAuthenticatedUser(override$);
    }
  }

  /**
   * Handles the authenticated user by subscribing to the override$ observable and displaying a success or error notification based on the response.
   * If the response has succeeded, the user is redirected to the profile page.
   * @param override$ - The observable that emits the response containing the RemoteData<EPerson> object.
   */
  handleAuthenticatedUser(override$: Observable<RemoteData<EPerson>>) {
    this.subs.push(
      override$.subscribe((response: RemoteData<EPerson>) => {
        if (response.hasSucceeded) {
          this.notificationService.success(
            this.translateService.get(
              'review-account-info.merge-data.notification.success',
            ),
          );
          this.router.navigate(['/profile']);
        } else if (response.hasFailed) {
          this.notificationService.error(
            this.translateService.get(
              'review-account-info.merge-data.notification.error',
            ),
          );
        }
      }),
    );
  }

  /**
   * Handles unauthenticated user by combining the override$, external auth location and redirect URL observables.
   * If the response has succeeded, sets the redirect URL to user profile and redirects to external registration type authentication URL.
   * If the response has failed, shows an error notification.
   * @param override$ - The override$ observable.
   * @param registrationType - The registration type.
   */
  handleUnauthenticatedUser(override$: Observable<RemoteData<EPerson>>, registrationType: string) {
    this.subs.push(
      combineLatest([
        override$,
        this.externalLoginService.getExternalAuthLocation(registrationType),
        this.authService.getRedirectUrl()])
        .subscribe(([response, location, redirectRoute]) => {
          if (response.hasSucceeded) {
            this.notificationService.success(
              this.translateService.get(
                'review-account-info.merge-data.notification.success',
              ),
            );
            // set Redirect URL to User profile, so the user is redirected to the profile page after logging in
            this.authService.setRedirectUrl('/profile');
            const externalServerUrl = this.authService.getExternalServerRedirectUrl(
              this._window.nativeWindow.origin,
              redirectRoute,
              location,
            );
            // redirect to external registration type authentication url
            this.hardRedirectService.redirect(externalServerUrl);
          } else if (response.hasFailed) {
            this.notificationService.error(
              this.translateService.get(
                'review-account-info.merge-data.notification.error',
              ),
            );
          }
        }),
    );
  }

  /**
   * Checks if the user is authenticated.
   * @returns An observable that emits a boolean value indicating whether the user is authenticated or not.
   */
  private isAuthenticated(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }

  /**
   * Prepare the data to compare and display:
   * -> For each metadata from the registration token, get the current value from the eperson.
   * -> Label is the metadata key without the prefix e.g `eperson.` but only `email`
   * -> Identifier is the metadata key with the prefix e.g `eperson.lastname`
   * -> Override value is false by default
   * @returns List of data to compare
   */
  private prepareDataToCompare(): ReviewAccountInfoData[] {
    const dataToCompare: ReviewAccountInfoData[] = [];
    Object.entries(this.registrationData.registrationMetadata).forEach(
      ([key, value]) => {
        // eperson.orcid is not always present in the registration metadata,
        // so display netId instead and skip it in the metadata in order not to have duplicate data.
        if (value[0].value === this.registrationData.netId) {
          return;
        }
        dataToCompare.push({
          label: key.split('.')?.[1] ?? key.split('.')?.[0],
          currentValue: value[0]?.overrides ?? '',
          receivedValue: value[0].value,
          overrideValue: false,
          identifier: key,
        });
      },
    );

    return dataToCompare;
  }

  ngOnDestroy(): void {
    this.subs.filter((s) => hasValue(s)).forEach((sub) => sub.unsubscribe());
  }
}
