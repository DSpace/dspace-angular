import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { BasicInformationBoxComponent } from './submit/form/box/basic-information/submission-submit-form-box-basic-information.component';
import { BoxDirective } from './submit/form/box/box.directive';
import { BoxHostDirective } from './submit/form/box/box-host.directive';
import { BoxService } from './submit/form/box/box.service';
import { SubmissionRoutingModule } from './submission-routing.module';
import { SubmissionSubmitComponent } from './submit/submission-submit.component';
import { SubmissionSubmitFormCollectionComponent } from './submit/form/collection/submission-submit-form-collection.component';
import { SubmissionSubmitFormFooterComponent } from './submit/form/footer/submission-submit-form-footer.component';
import { SubmissionSubmitFormComponent } from './submit/form/submission-submit-form.component';
import { SubmissionSubmitFormBoxHandlerComponent } from './submit/form/box/handler/submission-submit-form-box-handler.component';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    SubmissionRoutingModule
  ],
  declarations: [
    BasicInformationBoxComponent,
    BoxHostDirective,
    BoxDirective,
    SubmissionSubmitComponent,
    SubmissionSubmitFormBoxHandlerComponent,
    SubmissionSubmitFormCollectionComponent,
    SubmissionSubmitFormComponent,
    SubmissionSubmitFormFooterComponent
  ],
  entryComponents: [ BasicInformationBoxComponent ],
  exports: [
  ],
  providers: [
    BoxService
  ]
})
export class SubmissionModule {}
