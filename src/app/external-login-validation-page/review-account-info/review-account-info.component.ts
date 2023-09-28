import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPersonMock } from '../../shared/testing/eperson.mock';
import { RegistrationData } from '../../shared/external-log-in-complete/models/registration-data.model';
import { Observable, Subscription, filter, from, switchMap, take } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { hasValue } from 'src/app/shared/empty.util';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from 'src/app/core/shared/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { Router } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewAccountInfoComponent implements OnInit, OnDestroy {
  /**
   * The registration token sent from validation link
   */
  @Input() registrationToken: string;
  /**
   * User data from the registration token
   */
  @Input() registrationData: RegistrationData;

  /**
   * Text to display when the value is not applicable
   */
  notApplicableText = 'N/A';
  /**
   * List of data to compare
   */
  dataToCompare: ReviewAccountInfoData[] = [];
  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];
  /**
   * Current eperson data from the database,
   * so we can compare it with the data from the registration token
   */
  epersonCurrentData: EPerson;// = EPersonMock;

  constructor(
    private ePersonService: EPersonDataService,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private router: Router
  ) {
    // GET data from url validation link
    // Based on the URL data we get
    // 1. token
    // User should be automatically logged in
    // TODO: https://4science.atlassian.net/browse/CST-11609?focusedCommentId=206748
    // How to handle the case when the email is not part of metadata
    // and we have `eperson.orcid` in metadata list
  }

  ngOnInit(): void {
    this.getEPersonData();
    // TODO: remove after having data
    // this.dataToCompare = this.prepareDataToCompare();
  }

  /**
   * Get the current eperson data from the database.
   * If the eperson is found, prepare the data to compare.
   */
  getEPersonData() {
    if (
      hasValue(this.registrationData) &&
      hasValue(this.registrationData.user)
    ) {
      this.ePersonService
        .findById(this.registrationData.user)
        .pipe(getFirstCompletedRemoteData(), getRemoteDataPayload())
        .subscribe((eperson: EPerson) => {
          if (eperson) {
            this.epersonCurrentData = eperson;
            this.dataToCompare = this.prepareDataToCompare();
          }
        });
    }
  }

  /**
   * Find the data to compare based on the metadata key and update the override value
   * @param value value of the override checkbox
   * @param identifier the metadata key
   */
  public onOverrideChange(value: boolean, identifier: string) {
    this.dataToCompare.find(
      (data) => data.identifier === identifier
    ).overrideValue = value;
  }

  /**
   * Open a confirmation modal to confirm the override of the data
   * If confirmed, merge the data from the registration token with the data from the eperson
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

    this.subs.push(
      modalRef.componentInstance.response
        .pipe(take(1))
        .subscribe((confirm: boolean) => {
          if (confirm) {
            this.mergeEPersonDataWithToken();
          }
        })
    );
  }

  /**
   * Merge the data from the registration token with the data from the eperson.
   * If any of the metadata is overridden, sent a merge request for each metadata to override.
   * If none of the metadata is overridden, sent a merge request with the registration token only.
   */
  mergeEPersonDataWithToken() {
    let override$: Observable<RemoteData<EPerson>>;
    if (this.dataToCompare.some((d) => d.overrideValue)) {
      override$ = from(this.dataToCompare).pipe(
        filter((data: ReviewAccountInfoData) => data.overrideValue),
        switchMap((data: ReviewAccountInfoData) => {
          return this.ePersonService.mergeEPersonDataWithToken(
            this.epersonCurrentData.id,
            this.registrationToken,
            data.identifier
          );
        })
      );
    } else {
      override$ = this.ePersonService.mergeEPersonDataWithToken(
        this.epersonCurrentData.id,
        this.registrationToken
      );
    }
    this.subs.push(
      override$.subscribe((response: RemoteData<EPerson>) => {
        // TODO: https://4science.atlassian.net/browse/CST-11609?focusedCommentId=206748
        //  redirect to profile page
        if (response.hasSucceeded) {
          console.log('mergeEPersonDataWithToken', response.payload);
          this.notificationService.success(
            this.translateService.get(
              'review-account-info.merge-data.notification.success'
            )
          );
          this.router.navigate(['/profile']);
        }

        if (response.hasFailed) {
          this.notificationService.success(
            this.translateService.get(
              'review-account-info.merge-data.notification.error'
            )
          );
        }
      })
    );
  }

  /**
   * Prepare the data to compare and display:
   * -> For each metadata from the registration token, get the current value from the eperson.
   * -> Label is the metadata key without the prefix e.g `eperson.`
   * -> Identifier is the metadata key with the prefix e.g `eperson.lastname`
   * -> Override value is false by default
   * @returns List of data to compare
   */
  private prepareDataToCompare(): ReviewAccountInfoData[] {
    const dataToCompare: ReviewAccountInfoData[] = [];
    Object.entries(this.registrationData.registrationMetadata).forEach(
      ([key, value]) => {
        console.log(key, value);
        dataToCompare.push({
          label: key.split('.')?.[1] ?? key.split('.')?.[0],
          currentValue: this.getCurrentValue(key),
          receivedValue: value[0].value,
          overrideValue: false,
          identifier: key,
        });
      }
    );

    return dataToCompare;
  }

  /**
   * Return the current value of the metadata key from the eperson
   * @param metadata metadata key
   * @returns the current value of the metadata key from the eperson
   */
  private getCurrentValue(metadata: string): string {
    if (metadata === 'email') {
      return this.epersonCurrentData.email;
    }
    return this.epersonCurrentData.firstMetadataValue(metadata) ?? '';
  }

  ngOnDestroy(): void {
    this.subs.filter((s) => hasValue(s)).forEach((sub) => sub.unsubscribe());
  }
}
