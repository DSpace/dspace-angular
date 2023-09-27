import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { EpersonRegistrationService } from '../../../core/data/eperson-registration.service';
import { RemoteData } from '../../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalLoginService {

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private router: Router,
    private notificationService: NotificationsService
  ) { }


  patchUpdateRegistration(values: string[], field: string, registrationId: string, token: string, operation: 'add' | 'replace'): Observable<RemoteData<unknown>> {
    const updatedValues = values.map((value) => value);
    return this.epersonRegistrationService.patchUpdateRegistration(updatedValues, field, registrationId, token, operation).pipe(
      getFirstCompletedRemoteData(),
      map((rd) => {
        if (rd.hasSucceeded) {
          this.router.navigate(['/email-confirmation']);
        }
        if (rd.hasFailed) {
          console.log('Email update failed: email address was omitted or the operation is not valid', rd.errorMessage);
          this.notificationService.error('Something went wrong.Email address was omitted or the operation is not valid');
        }
        return rd;
      })
    );
  }
}
