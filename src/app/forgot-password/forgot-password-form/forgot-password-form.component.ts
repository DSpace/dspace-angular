import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticateAction } from '../../../../modules/core/src/lib/core/auth/auth.actions';
import { CoreState } from '../../../../modules/core/src/lib/core/core-state.model';
import { RemoteData } from '../../../../modules/core/src/lib/core/data/remote-data';
import { EPersonDataService } from '../../../../modules/core/src/lib/core/eperson/eperson-data.service';
import { EPerson } from '../../../../modules/core/src/lib/core/eperson/models/eperson.model';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../../modules/core/src/lib/core/shared/operators';
import { Registration } from '../../../../modules/core/src/lib/core/shared/registration.model';
import { ProfilePageSecurityFormComponent } from '../../profile-page/profile-page-security-form/profile-page-security-form.component';
import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { BrowserOnlyPipe } from '../../shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-base-forgot-password-form',
  styleUrls: ['./forgot-password-form.component.scss'],
  templateUrl: './forgot-password-form.component.html',
  imports: [
    TranslateModule,
    BrowserOnlyPipe,
    ProfilePageSecurityFormComponent,
    AsyncPipe,
    BtnDisabledDirective,
  ],
  standalone: true,
})
/**
 * Component for a user to enter a new password for a forgot token.
 */
export class ForgotPasswordFormComponent implements OnInit {

  registration$: Observable<Registration>;

  token: string;
  email: string;
  user: string;

  isInValid = true;
  password: string;

  /**
   * Prefix for the notification messages of this component
   */
  NOTIFICATIONS_PREFIX = 'forgot-password.form.notification';

  constructor(private ePersonDataService: EPersonDataService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private store: Store<CoreState>,
              private router: Router,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.registration$ = this.route.data.pipe(
      map((data) => data.registration as RemoteData<Registration>),
      getFirstSucceededRemoteDataPayload(),
    );
    this.registration$.subscribe((registration: Registration) => {
      this.email = registration.email;
      this.token = registration.token;
      this.user = registration.user;
    });
  }

  setInValid($event: boolean) {
    this.isInValid = $event;
  }

  setPasswordValue($event: string) {
    this.password = $event;
  }

  /**
   * Submits the password to the eperson service to be updated.
   * The submission will not be made when the form is not valid.
   */
  submit() {
    if (!this.isInValid) {
      this.ePersonDataService.patchPasswordWithToken(this.user, this.token, this.password).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((response: RemoteData<EPerson>) => {
        if (response.hasSucceeded) {
          this.notificationsService.success(
            this.translateService.instant(this.NOTIFICATIONS_PREFIX + '.success.title'),
            this.translateService.instant(this.NOTIFICATIONS_PREFIX + '.success.content'),
          );
          this.store.dispatch(new AuthenticateAction(this.email, this.password));
          this.router.navigate(['/home']);
        } else {
          this.notificationsService.error(
            this.translateService.instant(this.NOTIFICATIONS_PREFIX + '.error.title'), response.errorMessage,
          );
        }
      });
    }
  }
}
