import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProfilePageSecurityFormComponent } from '../../../../../app/profile-page/profile-page-security-form/profile-page-security-form.component';
import { CreateProfileComponent as BaseComponent } from '../../../../../app/register-page/create-profile/create-profile.component';

/**
 * Component that renders the create profile page to be used by a user registering through a token
 */
@Component({
  selector: 'ds-themed-create-profile',
  // styleUrls: ['./create-profile.component.scss'],
  styleUrls: ['../../../../../app/register-page/create-profile/create-profile.component.scss'],
  // templateUrl: './create-profile.component.html'
  templateUrl: '../../../../../app/register-page/create-profile/create-profile.component.html',
  standalone: true,
  imports: [
    ProfilePageSecurityFormComponent,
    TranslateModule,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
  ],
})
export class CreateProfileComponent extends BaseComponent {
}
