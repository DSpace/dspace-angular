import { CommonModule, NgOptimizedImage, } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAccordionModule, NgbCollapseModule, NgbModalModule, } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { Action, StoreConfig, StoreModule, } from '@ngrx/store';

import { LdnServicesService } from '../admin/admin-ldn-services/ldn-services-data/ldn-services-data.service';
import { storeModuleConfig } from '../app.reducer';
import { SubmissionAccessesConfigDataService } from '../core/config/submission-accesses-config-data.service';
import { SubmissionUploadsConfigDataService } from '../core/config/submission-uploads-config-data.service';
import { CoreModule } from '../core/core.module';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { FormModule } from '../shared/form/form.module';
import { SharedModule } from '../shared/shared.module';
import { UploadModule } from '../shared/upload/upload.module';
import { SubmissionEditComponent } from './edit/submission-edit.component';
import { ThemedSubmissionEditComponent } from './edit/themed-submission-edit.component';
import { SubmissionFormCollectionComponent } from './form/collection/submission-form-collection.component';
import { SubmissionFormFooterComponent } from './form/footer/submission-form-footer.component';
import { SubmissionFormSectionAddComponent } from './form/section-add/submission-form-section-add.component';
import { SubmissionFormComponent } from './form/submission-form.component';
import { SubmissionUploadFilesComponent } from './form/submission-upload-files/submission-upload-files.component';
import {
  SubmissionImportExternalCollectionComponent
} from './import-external/import-external-collection/submission-import-external-collection.component';
import {
  SubmissionImportExternalPreviewComponent
} from './import-external/import-external-preview/submission-import-external-preview.component';
import {
  SubmissionImportExternalSearchbarComponent
} from './import-external/import-external-searchbar/submission-import-external-searchbar.component';
import { SubmissionImportExternalComponent } from './import-external/submission-import-external.component';
import { ThemedSubmissionImportExternalComponent } from './import-external/themed-submission-import-external.component';
import { SubmissionSectionAccessesComponent } from './sections/accesses/section-accesses.component';
import { SectionAccessesService } from './sections/accesses/section-accesses.service';
import { SubmissionSectionCcLicensesComponent } from './sections/cc-license/submission-section-cc-licenses.component';
import { SubmissionSectionContainerComponent } from './sections/container/section-container.component';
import { SubmissionSectionDuplicatesComponent } from './sections/duplicates/section-duplicates.component';
import { SubmissionSectionFormComponent } from './sections/form/section-form.component';
import { SectionFormOperationsService } from './sections/form/section-form-operations.service';
import { SubmissionSectionIdentifiersComponent } from './sections/identifiers/section-identifiers.component';
import { SubmissionSectionLicenseComponent } from './sections/license/section-license.component';
import { CoarNotifyConfigDataService } from './sections/section-coar-notify/coar-notify-config-data.service';
import { SubmissionSectionCoarNotifyComponent } from './sections/section-coar-notify/section-coar-notify.component';
import { SectionsDirective } from './sections/sections.directive';
import { SectionsService } from './sections/sections.service';
import { ContentAccordionComponent } from './sections/sherpa-policies/content-accordion/content-accordion.component';
import {
  MetadataInformationComponent
} from './sections/sherpa-policies/metadata-information/metadata-information.component';
import {
  PublicationInformationComponent
} from './sections/sherpa-policies/publication-information/publication-information.component';
import { PublisherPolicyComponent } from './sections/sherpa-policies/publisher-policy/publisher-policy.component';
import { SubmissionSectionSherpaPoliciesComponent } from './sections/sherpa-policies/section-sherpa-policies.component';
import {
  SubmissionSectionUploadAccessConditionsComponent
} from './sections/upload/accessConditions/submission-section-upload-access-conditions.component';
import {
  SubmissionSectionUploadFileEditComponent
} from './sections/upload/file/edit/section-upload-file-edit.component';
import { SubmissionSectionUploadFileComponent } from './sections/upload/file/section-upload-file.component';
import {
  ThemedSubmissionSectionUploadFileComponent
} from './sections/upload/file/themed-section-upload-file.component';
import {
  SubmissionSectionUploadFileViewComponent
} from './sections/upload/file/view/section-upload-file-view.component';
import { SubmissionSectionUploadComponent } from './sections/upload/section-upload.component';
import { SectionUploadService } from './sections/upload/section-upload.service';
import { submissionEffects } from './submission.effects';
import { SubmissionSectionCorrectionComponent } from './sections/correction/section-correction.component';
import { MyDspaceSearchModule } from '../my-dspace-page/my-dspace-search.module';
import { SubmissionSubmitComponent } from './submit/submission-submit.component';
import { ThemedSubmissionSubmitComponent } from './submit/themed-submission-submit.component';
import { DetectDuplicateService } from './sections/detect-duplicate/detect-duplicate.service';
import { submissionReducers, SubmissionState } from './submission.reducers';
import { DuplicateMatchComponent } from './sections/detect-duplicate/duplicate-match/duplicate-match.component';
import {
  SubmissionSectionDetectDuplicateComponent
} from './sections/detect-duplicate/section-detect-duplicate.component';
import { SubmissionSectionCustomUrlComponent } from './sections/custom-url/submission-section-custom-url.component';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  SubmissionSectionUploadComponent,
  SubmissionSectionFormComponent,
  SubmissionSectionLicenseComponent,
  SubmissionSectionCcLicensesComponent,
  SubmissionSectionAccessesComponent,
  SubmissionSectionSherpaPoliciesComponent,
  SubmissionSectionCoarNotifyComponent,
  SubmissionSectionDuplicatesComponent,
  SubmissionSectionDetectDuplicateComponent,
  SubmissionSectionCustomUrlComponent,
  SubmissionSectionCorrectionComponent
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
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
  SubmissionSectionUploadAccessConditionsComponent,
  SubmissionSectionUploadFileComponent,
  SubmissionSectionUploadFileEditComponent,
  SubmissionSectionUploadFileViewComponent,
  SubmissionSectionIdentifiersComponent,
  SubmissionSectionDuplicatesComponent,
  SubmissionImportExternalComponent,
  ThemedSubmissionImportExternalComponent,
  SubmissionImportExternalSearchbarComponent,
  SubmissionImportExternalPreviewComponent,
  SubmissionImportExternalCollectionComponent,
  ContentAccordionComponent,
  PublisherPolicyComponent,
  PublicationInformationComponent,
  MetadataInformationComponent,
  ThemedSubmissionSectionUploadFileComponent,
  DuplicateMatchComponent
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    SharedModule,
    StoreModule.forFeature('submission', submissionReducers, storeModuleConfig as StoreConfig<SubmissionState, Action>),
    EffectsModule.forFeature(),
    EffectsModule.forFeature(submissionEffects),
    JournalEntitiesModule.withEntryComponents(),
    MyDspaceSearchModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    FormModule,
    NgbModalModule,
    NgbCollapseModule,
    NgbAccordionModule,
    UploadModule,
    NgOptimizedImage,
  ],
  declarations: DECLARATIONS,
  exports: [
    ...DECLARATIONS,
    FormModule,
  ],
  providers: [
    SectionUploadService,
    SectionsService,
    SubmissionUploadsConfigDataService,
    SubmissionAccessesConfigDataService,
    SectionAccessesService,
    SectionFormOperationsService,
    CoarNotifyConfigDataService,
    LdnServicesService,
    DetectDuplicateService
  ],
})

/**
 * This module handles all components that are necessary for the submission process
 */
export class SubmissionModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SubmissionModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
    };
  }
}
