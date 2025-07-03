import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProfilePageSecurityFormComponent } from '../../../../../app/profile-page/profile-page-security-form/profile-page-security-form.component';
import { CreateProfileComponent as BaseComponent } from '../../../../../app/register-page/create-profile/create-profile.component';
import { BtnDisabledDirective } from '../../../../../app/shared/btn-disabled.directive';

@Component({
  selector: 'ds-themed-create-profile',
  // styleUrls: ['./create-profile.component.scss'],
  styleUrls: ['../../../../../app/register-page/create-profile/create-profile.component.scss'],
  // templateUrl: './create-profile.component.html'
  templateUrl: '../../../../../app/register-page/create-profile/create-profile.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ProfilePageSecurityFormComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class CreateProfileComponent extends BaseComponent {
}
