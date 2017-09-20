import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { BasicInformationBoxComponent } from './submit/form/box/basic-information/submission-submit-form-box-basic-information.component';
import { BoxDirective } from './submit/form/box/box.directive';
import { BoxHostDirective } from './submit/form/box/box-host.directive';
import { BoxService } from './submit/form/box/box.service';
import { DefaultBoxComponent } from './submit/form/box/default/submission-submit-form-box-default.component';
import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionSubmitComponent } from './submit/submission-submit.component';
import { SubmissionSubmitFormCollectionComponent } from './submit/form/collection/submission-submit-form-collection.component';
import { SubmissionSubmitFormFooterComponent } from './submit/form/footer/submission-submit-form-footer.component';
import { SubmissionSubmitFormComponent } from './submit/form/submission-submit-form.component';
import { SubmissionSubmitFormBoxHandlerComponent } from './submit/form/box/handler/submission-submit-form-box-handler.component';
import { BoxFactoryComponent } from './submit/form/box/box.factory';
import { BoxContainerComponent } from './submit/form/box/box-container.component';
import { InjectBoxTemplateDirective } from './submit/form/box/box-inject.directive';
import { CommonModule } from '@angular/common';
import { BoxModelComponent } from './submit/form/box/box.model';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SubmissionRoutingModule
  ],
  declarations: [
    BasicInformationBoxComponent,
    BoxDirective,
    BoxContainerComponent,
    BoxHostDirective,
    DefaultBoxComponent,
    InjectBoxTemplateDirective,
    SubmissionSubmitComponent,
    SubmissionSubmitFormBoxHandlerComponent,
    SubmissionSubmitFormCollectionComponent,
    SubmissionSubmitFormComponent,
    SubmissionSubmitFormFooterComponent
  ],
  entryComponents: [ BoxContainerComponent, BasicInformationBoxComponent, DefaultBoxComponent ],
  exports: [
  ],
  providers: [
    BoxFactoryComponent,
    BoxService
  ]
})
export class SubmissionModule {}
