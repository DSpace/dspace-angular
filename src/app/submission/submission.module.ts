import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { SubmissionSectionformComponent } from './sections/form/section-form.component';
import { SectionsDirective } from './sections/sections.directive';
import { SectionsService } from './sections/sections.service';
import { SubmissionFormCollectionComponent } from './form/collection/submission-form-collection.component';
import { SubmissionFormFooterComponent } from './form/footer/submission-form-footer.component';
import { SubmissionFormComponent } from './form/submission-form.component';
import { SubmissionFormSectionAddComponent } from './form/section-add/submission-form-section-add.component';
import { SubmissionSectionContainerComponent } from './sections/container/section-container.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { submissionReducers } from './submission.reducers';
import { submissionEffects } from './submission.effects';
import { SubmissionSectionUploadComponent } from './sections/upload/section-upload.component';
import { SectionUploadService } from './sections/upload/section-upload.service';
import { SubmissionUploadFilesComponent } from './form/submission-upload-files/submission-upload-files.component';
import { SubmissionSectionLicenseComponent } from './sections/license/section-license.component';
import { SubmissionUploadsConfigService } from '../core/config/submission-uploads-config.service';
import { SubmissionEditComponent } from './edit/submission-edit.component';
import { SubmissionSectionUploadFileComponent } from './sections/upload/file/section-upload-file.component';
import { SubmissionSectionUploadFileEditComponent } from './sections/upload/file/edit/section-upload-file-edit.component';
import { SubmissionSectionUploadFileViewComponent } from './sections/upload/file/view/section-upload-file-view.component';
import { SubmissionSectionUploadAccessConditionsComponent } from './sections/upload/accessConditions/submission-section-upload-access-conditions.component';
import { SubmissionSubmitComponent } from './submit/submission-submit.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    StoreModule.forFeature('submission', submissionReducers, {}),
    EffectsModule.forFeature(submissionEffects),
    TranslateModule
  ],
  declarations: [
    SubmissionSectionUploadAccessConditionsComponent,
    SubmissionSectionUploadComponent,
    SubmissionSectionformComponent,
    SubmissionSectionLicenseComponent,
    SectionsDirective,
    SubmissionSectionContainerComponent,
    SubmissionEditComponent,
    SubmissionFormSectionAddComponent,
    SubmissionFormCollectionComponent,
    SubmissionFormComponent,
    SubmissionFormFooterComponent,
    SubmissionSubmitComponent,
    SubmissionUploadFilesComponent,
    SubmissionSectionUploadFileComponent,
    SubmissionSectionUploadFileEditComponent,
    SubmissionSectionUploadFileViewComponent
  ],
  entryComponents: [
    SubmissionSectionUploadComponent,
    SubmissionSectionformComponent,
    SubmissionSectionLicenseComponent,
    SubmissionSectionContainerComponent],
  exports: [
    SubmissionEditComponent,
    SubmissionFormComponent,
    SubmissionSubmitComponent
  ],
  providers: [
    SectionUploadService,
    SectionsService,
    SubmissionUploadsConfigService
  ]
})

/**
 * This module handles all components that are necessary for the submission process
 */
export class SubmissionModule {
}
