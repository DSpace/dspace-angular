import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { hasValue } from '../shared/empty.util';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { RemoteData } from '../core/data/remote-data';
import { Registration } from '../core/shared/registration.model';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { mockRegistrationDataModel } from '../shared/external-log-in-complete/models/registration-data.mock.model';

@Component({
  templateUrl: './external-login-page.component.html',
  styleUrls: ['./external-login-page.component.scss']
})
export class ExternalLoginPageComponent implements OnInit {

  public token: string;

  public registrationData: RegistrationData = mockRegistrationDataModel;

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private arouter: ActivatedRoute,
  ) {
    this.token = this.arouter.snapshot.queryParams.token;
  }

  ngOnInit(): void {
    if (hasValue(this.token)) {
      this.epersonRegistrationService.searchByToken(this.token).subscribe((registration: RemoteData<Registration>
        ) => {
        console.log('ExternalLoginPageComponent ngOnInit registration', registration);
        if (registration.hasSucceeded) {
          this.registrationData = Object.assign(new RegistrationData(), registration.payload);
          console.log('ExternalLoginPageComponent ngOnInit registrationData', this.registrationData);
        }
      });
    }
  }

}
