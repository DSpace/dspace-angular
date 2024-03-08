import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { MyDSpaceGuard } from './my-dspace.guard';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { CollectionSelectorComponent } from './collection-selector/collection-selector.component';
import {
  MyDSpaceNewSubmissionDropdownComponent
} from './my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component';
import {
  MyDSpaceNewExternalDropdownComponent
} from './my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';
import { SearchModule } from '../shared/search/search.module';
import { UploadModule } from '../shared/upload/upload.module';
import {
  MyDspaceQaEventsNotificationsComponent
} from './my-dspace-qa-events-notifications/my-dspace-qa-events-notifications.component';

const DECLARATIONS = [
  MyDSpacePageComponent,
  ThemedMyDSpacePageComponent,
  MyDSpaceNewSubmissionComponent,
  CollectionSelectorComponent,
  MyDSpaceNewSubmissionDropdownComponent,
  MyDSpaceNewExternalDropdownComponent,
  MyDspaceQaEventsNotificationsComponent
];

@NgModule({
    imports: [
        CommonModule,
        SearchModule,
        UploadModule,
        ...DECLARATIONS
    ],
    providers: [
        MyDSpaceGuard,
        MyDSpaceConfigurationService
    ],
    exports: DECLARATIONS
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {

}
