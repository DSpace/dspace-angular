import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EPerson } from '../core/eperson/models/eperson.model';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Group } from '../core/eperson/models/group.model';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list';
import { filter, switchMap, tap } from 'rxjs/operators';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../core/shared/operators';
import { hasValue } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';
import { AuthService } from '../core/auth/auth.service';

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
  @ViewChild(ProfilePageMetadataFormComponent, { static: false }) metadataForm: ProfilePageMetadataFormComponent;

  /**
   * A reference to the security form component
   */
  @ViewChild(ProfilePageSecurityFormComponent, { static: false }) securityForm: ProfilePageSecurityFormComponent;

  /**
   * The authenticated user
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
      getRemoteDataPayload()
    );
    this.groupsRD$ = this.user$.pipe(switchMap((user: EPerson) => user.groups));
  }

  /**
   * Fire an update on both the metadata and security forms
   * Show a warning notification when no changes were made in both forms
   */
  updateProfile() {
    const metadataChanged = this.metadataForm.updateProfile();
    const securityChanged = this.securityForm.updateSecurity();
    if (!metadataChanged && !securityChanged) {
      this.notificationsService.warning(
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.title'),
        this.translate.instant(this.NOTIFICATIONS_PREFIX + 'warning.no-changes.content')
      );
    }
  }
}
