import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ImportExternalRoutingModule } from './import-external-routing.module';
import { SubmissionImportExternalComponent } from '../submission/import-external/submission-import-external.component';
import { SubmissionImportExternalSearchbarComponent } from '../submission/import-external/import-external-searchbar/submission-import-external-searchbar.component';
import { SubmissionModule } from '../submission/submission.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    ImportExternalRoutingModule,
    SubmissionModule,
  ],
  declarations: [ ],
  entryComponents: [ ]
})

/**
 * This module handles all components that are necessary for the submission external import page
 */
export class ImportExternalPageModule {

}
