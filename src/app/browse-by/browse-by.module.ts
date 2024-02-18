import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByTitleComponent } from './browse-by-title/browse-by-title.component';
import { BrowseByMetadataComponent } from './browse-by-metadata/browse-by-metadata.component';
import { BrowseByDateComponent } from './browse-by-date/browse-by-date.component';
import { BrowseBySwitcherComponent } from './browse-by-switcher/browse-by-switcher.component';
import { BrowseByTaxonomyComponent } from './browse-by-taxonomy/browse-by-taxonomy.component';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';
import { DsoPageModule } from '../shared/dso-page/dso-page.module';
import { FormModule } from '../shared/form/form.module';
import { SharedModule } from '../shared/shared.module';

const DECLARATIONS = [
  BrowseBySwitcherComponent,
];

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  BrowseByTitleComponent,
  BrowseByMetadataComponent,
  BrowseByDateComponent,
  BrowseByTaxonomyComponent,
];

@NgModule({
  imports: [
    SharedBrowseByModule,
    CommonModule,
    DsoPageModule,
    FormModule,
    SharedModule,
  ],
  declarations: [
    ...DECLARATIONS,
    ...ENTRY_COMPONENTS
  ],
  exports: [
    ...DECLARATIONS,
    ...ENTRY_COMPONENTS,
  ]
})
export class BrowseByModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SharedBrowseByModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
