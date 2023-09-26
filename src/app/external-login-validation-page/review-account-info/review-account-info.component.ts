import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPersonMock } from '../../shared/testing/eperson.mock';
import { RegistrationData } from '../../shared/external-log-in-complete/models/registration-data.model';
import { mockRegistrationDataModel } from '../../shared/external-log-in-complete/models/registration-data.mock.model';
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
  registeredData: RegistrationData = mockRegistrationDataModel;

  epersonData: EPerson = EPersonMock;

  notApplicable = 'N/A';

  dataToCompare: ReviewAccountInfoData[] = [];

  constructor(private ePersonService: EPersonDataService) {
    // GET data from url validation link and display
  }

  ngOnInit(): void {
    this.dataToCompare = [
      {
        label: this.registeredData.registrationType,
        receivedValue: this.registeredData.netId,
        currentValue: this.notApplicable,
        overrideValue: false,
        identifier: 'netId',
      },
      {
        label: 'Last Name',
        receivedValue: this.getReceivedValue('eperson.lastname'),
        currentValue: this.getCurrentValue('eperson.lastname'),
        overrideValue: false,
        identifier: 'eperson.lastname',
      },
      {
        label: 'First Name',
        currentValue: this.getCurrentValue('eperson.firstname'),
        receivedValue: this.getReceivedValue('eperson.firstname'),
        overrideValue: false,
        identifier: 'eperson.firstname',
      },
      {
        label: 'Email',
        currentValue: this.epersonData.email,
        receivedValue: this.registeredData.email,
        overrideValue: false,
        identifier: 'email',
      },
    ];
  }

  getEPersonData() {
    // this.epersonData$ = this.ePersonService.findById()
    // .pipe(
    //   getFirstCompletedRemoteData(),
    //   getRemoteDataPayload()
    // );
  }

  getReceivedValue(metadata: string): string {
    return this.registeredData.registrationMetadata[metadata]?.[0]?.value;
  }

  getCurrentValue(metadata: string): string {
    return this.epersonData.firstMetadataValue(metadata);
  }

  test(value: boolean, identifier: string) {
    this.dataToCompare.find((data) => data.identifier === identifier).overrideValue = value;
    console.log(this.dataToCompare);
  }
}
