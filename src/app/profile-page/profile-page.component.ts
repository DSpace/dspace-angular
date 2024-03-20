import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { Group } from '../core/eperson/models/group.model';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import {
  getAllSucceededRemoteData,
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../core/shared/operators';
import { SuggestionsNotificationComponent } from '../notifications/suggestions-notification/suggestions-notification.component';
import {
  hasValue,
  isNotEmpty,
} from '../shared/empty.util';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { followLink } from '../shared/utils/follow-link-config.model';
import { VarDirective } from '../shared/utils/var.directive';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageResearcherFormComponent } from './profile-page-researcher-form/profile-page-researcher-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';

@Component({
  selector: 'ds-profile-page',
  styleUrls: ['./profile-page.component.scss'],
  templateUrl: './profile-page.component.html',
  imports: [
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    AsyncPipe,
    TranslateModule,
    ProfilePageResearcherFormComponent,
    VarDirective,
    NgIf,
    NgForOf,
    SuggestionsNotificationComponent,
  ],
  standalone: true,
})
/**
 * Component for a user to edit their profile information
 */
export class ProfilePageComponent implements OnInit {
  /**
   * A reference to the metadata form component
   */
  @ViewChild(ProfilePageMetadataFormComponent) metadataForm: ProfilePageMetadataFormComponent;

  /**
   * The authenticated user as observable
   */
  user$: Observable<EPerson>;

  /**
   * The groups the user belongs to
   */
  groupsRD$: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * The special groups the user belongs to
   */
  specialGroupsRD$: Observable<RemoteData<PaginatedList<Group>>>;

  /**
   * Prefix for the notification messages of this component
   */
  NOTIFICATIONS_PREFIX = 'profile.notifications.';

  /**
   * Prefix for the notification messages of this security form
   */
  PASSWORD_NOTIFICATIONS_PREFIX = 'profile.security.form.notifications.';

  /**
   * The validity of the password filled in, in the security form
   */
  private invalidSecurity: boolean;

  /**
   * The password filled in, in the security form
   */
  private password: string;
  /**
   * The current-password filled in, in the security form
   */
  private currentPassword: string;

  /**
   * The authenticated user
   */
  private currentUser: EPerson;
  canChangePassword$: Observable<boolean>;

  isResearcherProfileEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private epersonService: EPersonDataService,
              private authorizationService: AuthorizationDataService,
              private configurationService: ConfigurationDataService,
              public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getAuthenticatedUserFromStore().pipe(
      filter((user: EPerson) => hasValue(user.id)),
      switchMap((user: EPerson) => this.epersonService.findById(user.id, true, true, followLink('groups'))),
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      tap((user: EPerson) => this.currentUser = user),
    );
    this.groupsRD$ = this.user$.pipe(switchMap((user: EPerson) => user.groups));
    this.canChangePassword$ = this.user$.pipe(switchMap((user: EPerson) => this.authorizationService.isAuthorized(FeatureID.CanChangePassword, user._links.self.href)));
    this.specialGroupsRD$ = this.authService.getSpecialGroupsFromAuthStatus();

    this.configurationService.findByPropertyName('researcher-profile.entity-type').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((configRD: RemoteData<ConfigurationProperty>) => {
      this.isResearcherProfileEnabled$.next(configRD.hasSucceeded && configRD.payload.values.length > 0);
    });
  }

  /**
   * Fire an update on both the metadata and security forms
   * Show a warning notification when no changes were made in both forms
   */
  updateProfile() {
    const metadataChanged = this.metadataForm.updateProfile();
    const securityChanged = this.updateSecurity();
    if (!metadataChanged && !securityChanged) {
      this.notificationsService.warning(
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.title'),
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.content'),
      );
    }
  }

  /**
   * Sets the validity of the password based on an emitted of the form
   * @param $event
   */
  setInvalid($event: boolean) {
    this.invalidSecurity = $event;
  }

  /**
   * Update the user's security details
   *
   * Sends a patch request for changing the user's password when a new password is present and the password confirmation
   * matches the new password.
   * Nothing happens when no passwords are filled in.
   * An error notification is displayed when the password confirmation does not match the new password.
   *
   * Returns false when the password was empty
   */
  updateSecurity() {
    const passEntered = isNotEmpty(this.password);
    if (this.invalidSecurity) {
      this.notificationsService.error(this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'error.general'));
    }
    if (!this.invalidSecurity && passEntered) {
      const operations = [
        { 'op': 'add', 'path': '/password', 'value': { 'new_password': this.password, 'current_password': this.currentPassword } },
      ] as Operation[];
      this.epersonService.patch(this.currentUser, operations).pipe(getFirstCompletedRemoteData()).subscribe((response: RemoteData<EPerson>) => {
        if (response.hasSucceeded) {
          this.notificationsService.success(
            this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'success.title'),
            this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'success.content'),
          );
        } else {
          this.notificationsService.error(
            this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'error.title'),
            this.getPasswordErrorMessage(response),
          );
        }
      });
    }
    return passEntered;
  }

  /**
   * Set the password value based on the value emitted from the security form
   * @param $event
   */
  setPasswordValue($event: string) {
    this.password = $event;
  }

  /**
   * Set the current-password value based on the value emitted from the security form
   * @param $event
   */
  setCurrentPasswordValue($event: string) {
    this.currentPassword = $event;
  }

  /**
   * Submit of the security form that triggers the updateProfile method
   */
  submit() {
    this.updateProfile();
  }

  /**
   * Returns true if the researcher profile feature is enabled, false otherwise.
   */
  isResearcherProfileEnabled(): Observable<boolean> {
    return this.isResearcherProfileEnabled$.asObservable();
  }

  /**
   * Returns an error message from a password validation request with a specific reason or
   * a default message without specific reason.
   * @param response from the validation password patch request.
   */
  getPasswordErrorMessage(response) {
    if (response.hasFailed && isNotEmpty(response.errorMessage)) {
      // Response has a specific error message. Show this message in the error notification.
      return this.translate.instant(response.errorMessage);
    }
    // Show default error message notification.
    return this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'error.change-failed');
  }

}
