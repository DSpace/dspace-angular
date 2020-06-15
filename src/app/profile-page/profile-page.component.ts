import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EPerson } from '../core/eperson/models/eperson.model';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Group } from '../core/eperson/models/group.model';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list';
import { filter, switchMap, tap } from 'rxjs/operators';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../core/shared/operators';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';
import { AuthService } from '../core/auth/auth.service';
import { ErrorResponse, RestResponse } from '../core/cache/response.models';

@Component({
  selector: 'ds-profile-page',
  templateUrl: './profile-page.component.html'
})
/**
 * Component for a user to edit their profile information
 */
export class ProfilePageComponent implements OnInit {
  /**
   * A reference to the metadata form component
   */
  @ViewChild(ProfilePageMetadataFormComponent, {static: false}) metadataForm: ProfilePageMetadataFormComponent;

  /**
   * The authenticated user as observable
   */
  user$: Observable<EPerson>;

  /**
   * The groups the user belongs to
   */
  groupsRD$: Observable<RemoteData<PaginatedList<Group>>>;

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
   * The authenticated user
   */
  private currentUser: EPerson;

  constructor(private authService: AuthService,
              private notificationsService: NotificationsService,
              private translate: TranslateService,
              private epersonService: EPersonDataService) {
  }

  ngOnInit(): void {
    this.user$ = this.authService.getAuthenticatedUserFromStore().pipe(
      filter((user: EPerson) => hasValue(user.id)),
      switchMap((user: EPerson) => this.epersonService.findById(user.id, followLink('groups'))),
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      tap((user: EPerson) => this.currentUser = user)
    );
    this.groupsRD$ = this.user$.pipe(switchMap((user: EPerson) => user.groups));
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
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.content')
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
      const operation = Object.assign({op: 'replace', path: '/password', value: this.password});
      this.epersonService.patch(this.currentUser, [operation]).subscribe((response: RestResponse) => {
        if (response.isSuccessful) {
          this.notificationsService.success(
            this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'success.title'),
            this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'success.content')
          );
        } else {
          this.notificationsService.error(
            this.translate.instant(this.PASSWORD_NOTIFICATIONS_PREFIX + 'error.title'), (response as ErrorResponse).errorMessage
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
   * Submit of the security form that triggers the updateProfile method
   */
  submit() {
    this.updateProfile();
  }
}
