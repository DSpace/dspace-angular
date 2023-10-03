import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { EpersonRegistrationService } from '../../../core/data/eperson-registration.service';
import { RemoteData } from '../../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Registration } from 'src/app/core/shared/registration.model';

@Injectable({
  providedIn: 'root'
})
export class ExternalLoginService {

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private router: Router,
    private notificationService: NotificationsService,
    private translate: TranslateService
  ) { }

    /**
     * Update the registration data.
     * Send a patch request to the server to update the registration data.
     * @param values the values to update or add
     * @param field the filed to be updated
     * @param registrationId the registration id
     * @param token the registration token
     * @param operation operation to be performed
     */
  patchUpdateRegistration(values: string[], field: string, registrationId: string, token: string, operation: 'add' | 'replace'): Observable<RemoteData<Registration>>{
    const updatedValues = values.map((value) => value);
    return this.epersonRegistrationService.patchUpdateRegistration(updatedValues, field, registrationId, token, operation).pipe(
      getFirstCompletedRemoteData(),
      map((rd) => {
        if (rd.hasSucceeded) {
          this.router.navigate(['/email-confirmation']);
        }
        if (rd.hasFailed) {
          this.notificationService.error(this.translate.get('external-login-page.provide-email.notifications.error'));
        }
        return rd;
      })
    );
  }
}
