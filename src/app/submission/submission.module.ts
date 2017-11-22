import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { FormSectionComponent } from './section/form/section-form.component';
import { SectionDirective } from './section/section.directive';
import { SectionHostDirective } from './section/section-host.directive';
import { SectionService } from './section/section.service';
import { DefaultSectionComponent } from './section/default/section-default.component';
import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionSubmitComponent } from './submit/submission-submit.component';
import { SubmissionSubmitFormCollectionComponent } from './form/collection/submission-submit-form-collection.component';
import { SubmissionSubmitFormFooterComponent } from './form/footer/submission-submit-form-footer.component';
import { SubmissionSubmitFormComponent } from './form/submission-submit-form.component';
import { SubmissionSubmitFormSectionAddComponent } from './form/section-add/submission-submit-form-section-add.component';
import { SectionFactoryComponent } from './section/section.factory';
import { SectionContainerComponent } from './section/container/section-container.component';
import { InjectPanelTemplateDirective } from './section/section-inject.directive';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { submissionReducers } from './submission.reducers';
import { submissionEffects } from './submission.effects';
import { FilesSectionComponent } from './section/files/section-files.component';
import { FilesEditComponent } from './section/files/files-edit/files-edit.component';
import { PoliciesComponent } from './section/files/policies/policies.component';
import { BitstreamService } from './section/bitstream/bitstream.service';
import { SubmissionService } from './submission.service';
import { SubmissionUploadFilesComponent } from './form/submission-upload-files/submission-upload-files.component';
import { SubmissionRestService } from './submission-rest.service';
import { LicenseSectionComponent } from './section/license/section-license.component';
import { SubmissionUploadsConfigService } from '../core/config/submission-uploads-config.service';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    StoreModule.forFeature('submission', submissionReducers, { }),
    EffectsModule.forFeature(submissionEffects),
    SubmissionRoutingModule,
  ],
  declarations: [
    DefaultSectionComponent,
    FilesEditComponent,
    FilesSectionComponent,
    FormSectionComponent,
    InjectPanelTemplateDirective,
    LicenseSectionComponent,
    SectionDirective,
    SectionContainerComponent,
    SectionHostDirective,
    PoliciesComponent,
    SubmissionSubmitComponent,
    SubmissionSubmitFormSectionAddComponent,
    SubmissionSubmitFormCollectionComponent,
    SubmissionSubmitFormComponent,
    SubmissionSubmitFormFooterComponent,
    SubmissionUploadFilesComponent
  ],
  entryComponents: [ DefaultSectionComponent, FilesSectionComponent, FormSectionComponent, LicenseSectionComponent, SectionContainerComponent ],
  exports: [
  ],
  providers: [
    BitstreamService,
    SectionFactoryComponent,
    SectionService,
    SubmissionService,
    SubmissionRestService,
    SubmissionUploadsConfigService
  ]
})
export class SubmissionModule {}
