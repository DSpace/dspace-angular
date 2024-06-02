import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SuggestionsNotificationComponent } from '../../../../app/notifications/suggestions-notification/suggestions-notification.component';
import { ProfilePageComponent as BaseComponent } from '../../../../app/profile-page/profile-page.component';
import { ThemedProfilePageMetadataFormComponent } from '../../../../app/profile-page/profile-page-metadata-form/themed-profile-page-metadata-form.component';
import { ProfilePageResearcherFormComponent } from '../../../../app/profile-page/profile-page-researcher-form/profile-page-researcher-form.component';
import { ProfilePageSecurityFormComponent } from '../../../../app/profile-page/profile-page-security-form/profile-page-security-form.component';
import { VarDirective } from '../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-profile-page',
  // styleUrls: ['./profile-page.component.scss'],
  styleUrls: ['../../../../app/profile-page/profile-page.component.scss'],
  // templateUrl: './profile-page.component.html'
  templateUrl: '../../../../app/profile-page/profile-page.component.html',
  standalone: true,
  imports: [
    ThemedProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    AsyncPipe,
    TranslateModule,
    ProfilePageResearcherFormComponent,
    VarDirective,
    NgIf,
    NgForOf,
    SuggestionsNotificationComponent,
  ],
})
/**
 * Component for a user to edit their profile information
 */
export class ProfilePageComponent extends BaseComponent {

}
