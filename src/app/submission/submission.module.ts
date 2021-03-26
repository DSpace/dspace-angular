import { NgModule } from '@angular/core';
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
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { submissionReducers, SubmissionState } from './submission.reducers';
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
import { storeModuleConfig } from '../app.reducer';
import { SubmissionImportExternalComponent } from './import-external/submission-import-external.component';
import { SubmissionImportExternalSearchbarComponent } from './import-external/import-external-searchbar/submission-import-external-searchbar.component';
import { SubmissionImportExternalPreviewComponent } from './import-external/import-external-preview/submission-import-external-preview.component';
import { SubmissionImportExternalCollectionComponent } from './import-external/import-external-collection/submission-import-external-collection.component';
import { SubmissionSectionCcLicensesComponent } from './sections/cc-license/submission-section-cc-licenses.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedSubmissionEditComponent } from './edit/themed-submission-edit.component';
import { ThemedSubmissionSubmitComponent } from './submit/themed-submission-submit.component';
import { ThemedSubmissionImportExternalComponent } from './import-external/themed-submission-import-external.component';

const DECLARATIONS = [
  SubmissionSectionUploadAccessConditionsComponent,
  SubmissionSectionUploadComponent,
  SubmissionSectionformComponent,
  SubmissionSectionLicenseComponent,
  SubmissionSectionCcLicensesComponent,
  SectionsDirective,
  SubmissionEditComponent,
  ThemedSubmissionEditComponent,
  SubmissionFormSectionAddComponent,
  SubmissionFormCollectionComponent,
  SubmissionFormComponent,
  SubmissionFormFooterComponent,
  SubmissionSubmitComponent,
  ThemedSubmissionSubmitComponent,
  SubmissionUploadFilesComponent,
  SubmissionSectionContainerComponent,
  SubmissionSectionUploadFileComponent,
  SubmissionSectionUploadFileEditComponent,
  SubmissionSectionUploadFileViewComponent,
  SubmissionImportExternalComponent,
  ThemedSubmissionImportExternalComponent,
  SubmissionImportExternalSearchbarComponent,
  SubmissionImportExternalPreviewComponent,
  SubmissionImportExternalCollectionComponent
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    SharedModule,
    StoreModule.forFeature('submission', submissionReducers, storeModuleConfig as StoreConfig<SubmissionState, Action>),
    EffectsModule.forFeature(submissionEffects),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
  ],
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
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
