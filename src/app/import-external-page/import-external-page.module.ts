import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { SharedModule } from '../shared/shared.module';
import { SubmissionModule } from '../submission/submission.module';
import { ImportExternalPageComponent } from './import-external-page.component';
import { ImportExternalRoutingModule } from './import-external-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    CoreModule.forRoot(),
    ImportExternalRoutingModule,
    SubmissionModule,
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
  ],
  declarations: [
    ImportExternalPageComponent,
  ],
})

/**
 * This module handles all components that are necessary for the submission external import page
 */
export class ImportExternalPageModule {

}
