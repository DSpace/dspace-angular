import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, map, tap } from 'rxjs';
import { EpersonRegistrationService } from '../../../core/data/eperson-registration.service';
import { RemoteData } from '../../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NoContent } from '../../../core/shared/NoContent.model';
import { AuthMethod } from 'src/app/core/auth/models/auth.method';
import { getAuthenticationMethods } from 'src/app/core/auth/selectors';
import { Store, select } from '@ngrx/store';
import { CoreState } from 'src/app/core/core-state.model';

@Injectable({
  providedIn: 'root'
})
export class ExternalLoginService {

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private router: Router,
    private notificationService: NotificationsService,
    private translate: TranslateService,
    private store: Store<CoreState>,
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
  patchUpdateRegistration(values: string[], field: string, registrationId: string, token: string, operation: 'add' | 'replace'): Observable<RemoteData<NoContent>> {
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

  /**
   * Returns an Observable that emits the external authentication location for the given registration type.
   * @param registrationType The type of registration to get the external authentication location for.
   * @returns An Observable that emits the external authentication location as a string.
   */
  getExternalAuthLocation(registrationType: string): Observable<string> {
    return this.store.pipe(
      select(getAuthenticationMethods),
      filter((methods: AuthMethod[]) => methods.length > 0),
      tap((methods: AuthMethod[]) => console.log(methods.find(m => m.authMethodType === registrationType.toLocaleLowerCase()), methods.find(m => m.authMethodType === registrationType.toLocaleLowerCase()).location)),
      map((methods: AuthMethod[]) => methods.find(m => m.authMethodType === registrationType.toLocaleLowerCase()).location),
    );
  }
}
