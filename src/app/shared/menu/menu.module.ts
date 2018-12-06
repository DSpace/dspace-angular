import { MenuSectionComponent } from './menu-section/menu-section.component';
import { MenuComponent } from './menu.component';
import { LinkTypeMenuItemComponent } from './type-components/link-type.component';
import { TextTypeMenuItemComponent } from './type-components/text-type.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

const COMPONENTS = [
  MenuSectionComponent,
  MenuComponent,
  LinkTypeMenuItemComponent,
  TextTypeMenuItemComponent
];

const ENTRY_COMPONENTS = [
  LinkTypeMenuItemComponent,
  TextTypeMenuItemComponent
];

const MODULES = [
  TranslateModule,
  RouterModule
];
const PROVIDERS = [

];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS,
    ...MODULES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})

/**
 * This module handles all components and pipes that need to be shared among multiple other modules
 */
export class MenuModule {

}
