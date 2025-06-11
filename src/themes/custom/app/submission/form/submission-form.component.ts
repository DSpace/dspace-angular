import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { SubmissionFormCollectionComponent } from '../../../../../app/submission/form/collection/submission-form-collection.component';
import { ThemedSubmissionFormFooterComponent } from '../../../../../app/submission/form/footer/themed-submission-form-footer.component';
import { SubmissionFormSectionAddComponent } from '../../../../../app/submission/form/section-add/submission-form-section-add.component';
import { SubmissionFormComponent as BaseComponent } from '../../../../../app/submission/form/submission-form.component';
import { ThemedSubmissionUploadFilesComponent } from '../../../../../app/submission/form/submission-upload-files/themed-submission-upload-files.component';
import { ThemedSubmissionSectionContainerComponent } from '../../../../../app/submission/sections/container/themed-section-container.component';

@Component({
  selector: 'ds-themed-submission-form',
  // styleUrls: ['./submission-form.component.scss'],
  styleUrls: ['../../../../../app/submission/form/submission-form.component.scss'],
  // templateUrl: './submission-form.component.html'
  templateUrl: '../../../../../app/submission/form/submission-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SubmissionFormCollectionComponent,
    SubmissionFormSectionAddComponent,
    ThemedLoadingComponent,
    ThemedSubmissionFormFooterComponent,
    ThemedSubmissionSectionContainerComponent,
    ThemedSubmissionUploadFilesComponent,
    TranslatePipe,
  ],
})
export class SubmissionFormComponent extends BaseComponent {

}
