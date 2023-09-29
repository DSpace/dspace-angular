import { Component } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { ActivatedRoute } from '@angular/router';
import { AlertType } from '../shared/alert/aletr-type';
import { hasNoValue, hasValue } from '../shared/empty.util';
import { getRemoteDataPayload } from '../core/shared/operators';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { Registration } from '../core/shared/registration.model';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { RemoteData } from '../core/data/remote-data';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { MetadataValue } from '../core/shared/metadata.models';
import { EPerson } from '../core/eperson/models/eperson.model';
import { mockRegistrationDataModel } from '../shared/external-log-in-complete/models/registration-data.mock.model';

@Component({
  templateUrl: './external-login-validation-page.component.html',
  styleUrls: ['./external-login-validation-page.component.scss'],
})
export class ExternalLoginValidationPageComponent {
  /**
   * The token used to get the registration data
   */
  public token: string;

  /**
   * The type of alert to show
   */
  public AlertTypeEnum = AlertType;

  private validationFailed: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private arouter: ActivatedRoute,
    private epersonDataService: EPersonDataService,
    private notificationService: NotificationsService,
    private translateService: TranslateService
  ) {
    this.token = this.arouter.snapshot.queryParams.token;
    this.token = '1234567890'; // TODO: remove this line (temporary)
  }

  ngOnInit(): void {
    // TODO: Uncomment this line later
    // this.getRegistrationData();
  }

  public hasFailed(): Observable<boolean> {
    return this.validationFailed.asObservable();
  }

  /**
   * Get the registration data from the token
   */
  getRegistrationData() {
    this.validationFailed.next(true);

    if (hasValue(this.token)) {
      this.fetchRegistrationDataAndCreateUser(this.token);
    }
  }

  fetchRegistrationDataAndCreateUser(token: string) {
    this.epersonRegistrationService
      .searchByToken(token)
      .pipe(
        switchMap((rd) => {
          if (hasValue(rd.payload) && hasNoValue(rd.payload.user)) {
            const registrationData = Object.assign(
              new RegistrationData(),
              rd.payload
            );
            return this.createUserFromToken(token, registrationData);
          } else {
            return of(rd);
          }
        })
      )
      .subscribe((rd: RemoteData<Registration>) => {
        if (rd.hasFailed) {
          this.validationFailed.next(true);
        }
      });
  }

  createUserFromToken(token: string, registrationData: RegistrationData) {
    const metadataValues = Object.entries(registrationData.registrationMetadata)
      .filter(([key, value]) => hasValue(value[0]?.value))
      .map(([key, value]) => ({
        key,
        value: value[0]?.value,
      }));
    const eperson = Object.assign(new EPerson(), {
      metadata: metadataValues,
      canLogIn: true,
      requireCertificate: false,
    });
    return this.epersonDataService.createEPersonForToken(eperson, token).pipe(
      tap((rd: RemoteData<EPerson>) => {
        if (rd.hasFailed) {
          this.validationFailed.next(true);
        }
      })
    );
  }
}
