import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EPerson } from '../core/eperson/models/eperson.model';
import { select, Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../core/auth/selectors';
import { AppState } from '../app.reducer';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-profile-page',
  templateUrl: './profile-page.component.html'
})
/**
 * Component for a user to edit their profile information
 */
export class ProfilePageComponent implements OnInit {

  @ViewChild(ProfilePageMetadataFormComponent, { static: false }) metadataForm: ProfilePageMetadataFormComponent;

  @ViewChild(ProfilePageSecurityFormComponent, { static: false }) securityForm: ProfilePageSecurityFormComponent;

  /**
   * The authenticated user
   */
  user$: Observable<EPerson>;

  NOTIFICATIONS_PREFIX = 'profile.notifications.';

  constructor(private store: Store<AppState>,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(getAuthenticatedUser));
  }

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
