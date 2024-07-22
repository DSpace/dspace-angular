import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { DsoEditMenuExpandableSectionComponent } from './dso-edit-menu/dso-edit-expandable-menu-section/dso-edit-menu-expandable-section.component';
import { DsoEditMenuComponent } from './dso-edit-menu/dso-edit-menu.component';
import { DsoEditMenuSectionComponent } from './dso-edit-menu/dso-edit-menu-section/dso-edit-menu-section.component';

const COMPONENTS = [
  DsoEditMenuComponent,
  DsoEditMenuSectionComponent,
  DsoEditMenuExpandableSectionComponent,
];

const ENTRY_COMPONENTS = [
];

const MODULES = [
  TranslateModule,
  RouterModule,
  CommonModule,
  NgbTooltipModule,
  NgbDropdownModule,
];
const PROVIDERS = [

];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  providers: [
    ...PROVIDERS,
    ...ENTRY_COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})

/**
 * This module handles all components, providers and modules that are needed for the menu
 */
export class DsoPageModule {

}
