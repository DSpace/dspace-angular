import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ProfilePageMetadataFormComponent as BaseComponent } from '../../../../../app/profile-page/profile-page-metadata-form/profile-page-metadata-form.component';
import { FormComponent } from '../../../../../app/shared/form/form.component';

@Component({
  selector: 'ds-themed-profile-page-metadata-form',
  templateUrl: '../../../../../app/profile-page/profile-page-metadata-form/profile-page-metadata-form.component.html',
  // templateUrl: './profile-page-metadata-form.component.html',
  imports: [
    FormComponent,
    NgIf,
  ],
  standalone: true,
})
export class ProfilePageMetadataFormComponent extends BaseComponent {
}
