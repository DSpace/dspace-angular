import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
} from '@angular/core';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPersonMock } from '../../shared/testing/eperson.mock';
import { RegistrationData } from '../../shared/external-log-in-complete/models/registration-data.model';
import { filter, from, switchMap, take } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
export class ReviewAccountInfoComponent implements OnInit {
  @Input() registrationToken: string;

  @Input() registrationData: RegistrationData;

  epersonData: EPerson = EPersonMock;

  notApplicableText = 'N/A';

  dataToCompare: ReviewAccountInfoData[] = [];

  constructor(
    private ePersonService: EPersonDataService,
    private modalService: NgbModal
  ) {
    // GET data from url validation link and display
    // Based on the URL data we get
    // 1. token
    // 1. login user
    // TODO: https://4science.atlassian.net/browse/CST-11609?focusedCommentId=206748
    // the header in the review page must show that the user is logged in
  }

  ngOnInit(): void {
    this.dataToCompare = this.prepareDataToCompare();
  }

  private prepareDataToCompare() {
    const dataToCompare: ReviewAccountInfoData[] = [];
    Object.entries(this.registrationData.registrationMetadata).forEach(
      ([key, value]) => {
        console.log(key, value);
        dataToCompare.push({
          label: key.split('.')?.[1],
          currentValue: this.getCurrentValue(key),
          receivedValue: value[0].value,
          overrideValue: false,
          identifier: key,
        });
      }
    );

    return dataToCompare;
  }

  getEPersonData() {
    // this.epersonData$ = this.ePersonService.findById()
    // .pipe(
    //   getFirstCompletedRemoteData(),
    //   getRemoteDataPayload()
    // );
  }

  private getCurrentValue(metadata: string): string {
    return this.epersonData.firstMetadataValue(metadata);
  }

  public onOverrideChange(value: boolean, identifier: string) {
    this.dataToCompare.find(
      (data) => data.identifier === identifier
    ).overrideValue = value;
  }

  /**
   * Merge the data from the registration token with the data from the eperson
   */
  public mergeEPersonRegistrationData() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.headerLabel = 'confirmation-modal.review-account-info.header';
    modalRef.componentInstance.infoLabel = 'confirmation-modal.review-account-info.info';
    modalRef.componentInstance.cancelLabel = 'confirmation-modal.review-account-info.cancel';
    modalRef.componentInstance.confirmLabel = 'confirmation-modal.review-account-info.confirm';
    modalRef.componentInstance.brandColor = 'primary';
    modalRef.componentInstance.confirmIcon = 'fa fa-check';
    modalRef.componentInstance.response
      .pipe(take(1))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          from(this.dataToCompare)
            .pipe(
              // what happens when is not overriden?
              filter((data: ReviewAccountInfoData) => data.overrideValue),
              switchMap((data: ReviewAccountInfoData) => {
                return this.ePersonService.mergeEPersonDataWithToken(
                  this.epersonData.id,
                  this.registrationToken,
                  data.identifier
                );
              })
            )
            .subscribe((response: RemoteData<EPerson>) => {
              // TODO: https://4science.atlassian.net/browse/CST-11609?focusedCommentId=206748
              //  redirect to profile page
              if (response.hasSucceeded) {
                console.log(response.payload);
              }

              if (response.hasFailed) {
                console.log(response.errorMessage);
              }
            });
        }
      });
  }
}
