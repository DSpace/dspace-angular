import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { FormPanelComponent } from './panel/form/panel-form.component';
import { PanelDirective } from './panel/panel.directive';
import { PanelHostDirective } from './panel/panel-host.directive';
import { PanelService } from './panel/panel.service';
import { DefaultPanelComponent } from './panel/default/panel-default.component';
import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionSubmitComponent } from './submit/submission-submit.component';
import { SubmissionSubmitFormCollectionComponent } from './submit/form/collection/submission-submit-form-collection.component';
import { SubmissionSubmitFormFooterComponent } from './submit/form/footer/submission-submit-form-footer.component';
import { SubmissionSubmitFormComponent } from './submit/form/submission-submit-form.component';
import { SubmissionSubmitFormPanelAddComponent } from './submit/form/panel-add/submission-submit-form-panel-add.component';
import { PanelFactoryComponent } from './panel/panel.factory';
import { PanelContainerComponent } from './panel/container/panel-container.component';
import { InjectPanelTemplateDirective } from './panel/panel-inject.directive';
import { CommonModule } from '@angular/common';
// import { PanelModelComponent } from './panel/panel.model';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { submissionReducers } from './submission.reducers';
import { submissionEffects } from './submission.effects';
import { FilesPanelComponent } from './panel/files/panel-files.component';
import { FilesEditComponent } from './panel/files/files-edit/files-edit.component';
import { PoliciesComponent } from './panel/files/policies/policies.component';
import { BitstreamService } from './panel/bitstream/bitstream.service';
import { SubmissionService } from './submission.service';
import { SubmissionUploadFilesComponent } from './submit/form/submission-upload-files/submission-upload-files.component';

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
    DefaultPanelComponent,
    FilesEditComponent,
    FilesPanelComponent,
    FormPanelComponent,
    InjectPanelTemplateDirective,
    PanelDirective,
    PanelContainerComponent,
    PanelHostDirective,
    PoliciesComponent,
    SubmissionSubmitComponent,
    SubmissionSubmitFormPanelAddComponent,
    SubmissionSubmitFormCollectionComponent,
    SubmissionSubmitFormComponent,
    SubmissionSubmitFormFooterComponent,
    SubmissionUploadFilesComponent
  ],
  entryComponents: [ DefaultPanelComponent, FilesPanelComponent, FormPanelComponent, PanelContainerComponent ],
  exports: [
  ],
  providers: [
    BitstreamService,
    PanelFactoryComponent,
    PanelService,
    SubmissionService
  ]
})
export class SubmissionModule {}
