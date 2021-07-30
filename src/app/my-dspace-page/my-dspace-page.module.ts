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
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';

const DECLARATIONS = [
  MyDSpacePageComponent,
  ThemedMyDSpacePageComponent,
  MyDSpaceResultsComponent,
  MyDSpaceNewSubmissionComponent,
  CollectionSelectorComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
    MyDspaceSearchModule.withEntryComponents()
  ],
  declarations: DECLARATIONS,
  providers: [
    MyDSpaceGuard,
    MyDSpaceConfigurationService
  ],
  exports: DECLARATIONS,
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {

}
