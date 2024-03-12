import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AbstractControl,
  AbstractControl,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DYNAMIC_ERROR_MESSAGES_MATCHER,
  DynamicErrorMessagesMatcher,
} from '@ng-dynamic-forms/core';

import { FormModule } from '../shared/form/form.module';
import { SearchModule } from '../shared/search/search.module';
import { BulkAccessBrowseComponent } from './bulk-access/browse/bulk-access-browse.component';
import { BulkAccessComponent } from './bulk-access/bulk-access.component';
import { BulkAccessSettingsComponent } from './bulk-access/settings/bulk-access-settings.component';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { EPersonFormComponent } from './epeople-registry/eperson-form/eperson-form.component';
import { GroupFormComponent } from './group-registry/group-form/group-form.component';
import { MembersListComponent } from './group-registry/group-form/members-list/members-list.component';
import { SubgroupsListComponent } from './group-registry/group-form/subgroup-list/subgroups-list.component';
import { GroupsRegistryComponent } from './group-registry/groups-registry.component';

/**
 * Condition for displaying error messages on email form field
 */
export const ValidateEmailErrorStateMatcher: DynamicErrorMessagesMatcher =
  (control: AbstractControl, model: any, hasFocus: boolean) => {
    return (control.touched && !hasFocus) || (control.errors?.emailTaken && hasFocus);
  };

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormModule,
    NgbAccordionModule,
    SearchModule,
    EPeopleRegistryComponent,
    EPersonFormComponent,
    GroupsRegistryComponent,
    GroupFormComponent,
    SubgroupsListComponent,
    MembersListComponent,
    BulkAccessComponent,
    BulkAccessBrowseComponent,
    BulkAccessSettingsComponent,
  ],
  exports: [
    MembersListComponent,
  ],
  providers: [
    {
      provide: DYNAMIC_ERROR_MESSAGES_MATCHER,
      useValue: ValidateEmailErrorStateMatcher,
    },
  ],
})
/**
 * This module handles all components related to the access control pages
 */
export class AccessControlModule {

}
