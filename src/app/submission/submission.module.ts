import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { FormSectionComponent } from './sections/form/section-form.component';
import { SectionsDirective } from './sections/sections.directive';
import { SectionsService } from './sections/sections.service';
import { DefaultSectionComponent } from './sections/default/section-default.component';
import { SubmissionFormCollectionComponent } from './form/collection/submission-form-collection.component';
import { SubmissionFormFooterComponent } from './form/footer/submission-form-footer.component';
import { SubmissionFormComponent } from './form/submission-form.component';
import { SubmissionFormSectionAddComponent } from './form/section-add/submission-form-section-add.component';
import { SectionContainerComponent } from './sections/container/section-container.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { submissionReducers } from './submission.reducers';
import { submissionEffects } from './submission.effects';
import { UploadSectionComponent } from './sections/upload/section-upload.component';
import { SectionUploadService } from './sections/upload/section-upload.service';
import { SubmissionUploadFilesComponent } from './form/submission-upload-files/submission-upload-files.component';
import { SubmissionRestService } from './submission-rest.service';
import { LicenseSectionComponent } from './sections/license/section-license.component';
import { SubmissionUploadsConfigService } from '../core/config/submission-uploads-config.service';
import { SubmissionEditComponent } from './edit/submission-edit.component';
import { UploadSectionFileComponent } from './sections/upload/file/file.component';
import { UploadSectionFileEditComponent } from './sections/upload/file/edit/file-edit.component';
import { UploadSectionFileViewComponent } from './sections/upload/file/view/file-view.component';
import { AccessConditionsComponent } from './sections/upload/accessConditions/accessConditions.component';
import { RecycleSectionComponent } from './sections/recycle/section-recycle.component';
import { DetectDuplicateSectionComponent } from './sections/detect-duplicate/section-detect-duplicate.component';
import { DuplicateMatchComponent } from './sections/detect-duplicate/duplicate-match/duplicate-match.component';
import { DetectDuplicateService } from './sections/detect-duplicate/detect-duplicate.service';
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
    AccessConditionsComponent,
    DefaultSectionComponent,
    UploadSectionComponent,
    FormSectionComponent,
    LicenseSectionComponent,
    SectionsDirective,
    SectionContainerComponent,
    SubmissionEditComponent,
    SubmissionFormSectionAddComponent,
    SubmissionFormCollectionComponent,
    SubmissionFormComponent,
    SubmissionFormFooterComponent,
    SubmissionSubmitComponent,
    SubmissionUploadFilesComponent,
    UploadSectionFileComponent,
    UploadSectionFileEditComponent,
    UploadSectionFileViewComponent,
    RecycleSectionComponent,
    DetectDuplicateSectionComponent,
    DuplicateMatchComponent,
  ],
  entryComponents: [
    DefaultSectionComponent,
    UploadSectionComponent,
    FormSectionComponent,
    LicenseSectionComponent,
    SectionContainerComponent,
    RecycleSectionComponent,
    DetectDuplicateSectionComponent],
  exports: [
    SubmissionEditComponent,
    SubmissionFormComponent,
    SubmissionSubmitComponent
  ],
  providers: [
    SectionUploadService,
    SectionsService,
    SubmissionRestService,
    SubmissionUploadsConfigService,
    DetectDuplicateService
  ]
})
export class SubmissionModule {
}
