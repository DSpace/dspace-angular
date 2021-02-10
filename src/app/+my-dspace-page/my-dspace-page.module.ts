import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDSpaceResultsComponent } from './my-dspace-results/my-dspace-results.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { MyDSpaceGuard } from './my-dspace.guard';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { CollectionSelectorComponent } from './collection-selector/collection-selector.component';
import { MyDspaceSearchModule } from './my-dspace-search.module';
import { MyDSpaceNewSubmissionDropdownComponent } from './my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component';
import { MyDSpaceNewExternalDropdownComponent } from './my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component';
import { SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { OpenaireSuggestionsDataService } from '../core/openaire/reciter-suggestions/openaire-suggestions-data.service';
import { OpenaireModule } from '../openaire/openaire.module';
import { MyDSpaceNewBulkImportComponent } from './my-dspace-new-submission/my-dspace-new-bulk-import/my-dspace-new-bulk-import.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
    MyDspaceSearchModule.withEntryComponents(),
    OpenaireModule
  ],
  declarations: [
    MyDSpacePageComponent,
    MyDSpaceResultsComponent,
    MyDSpaceNewSubmissionComponent,
    CollectionSelectorComponent,
    MyDSpaceNewSubmissionDropdownComponent,
    MyDSpaceNewExternalDropdownComponent,
    MyDSpaceNewBulkImportComponent
  ],
  providers: [
    MyDSpaceGuard,
    MyDSpaceConfigurationService,
    SuggestionsService,
    OpenaireSuggestionsDataService
  ]
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {

}
