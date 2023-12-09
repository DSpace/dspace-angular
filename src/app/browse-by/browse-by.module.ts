import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseByTitlePageComponent } from './browse-by-title-page/browse-by-title-page.component';
import { BrowseByMetadataPageComponent } from './browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseByDatePageComponent } from './browse-by-date-page/browse-by-date-page.component';
import { BrowseBySwitcherComponent } from './browse-by-switcher/browse-by-switcher.component';
import { BrowseByTaxonomyPageComponent } from './browse-by-taxonomy-page/browse-by-taxonomy-page.component';
import { SharedBrowseByModule } from '../shared/browse-by/shared-browse-by.module';
import { DsoPageModule } from '../shared/dso-page/dso-page.module';
import { FormModule } from '../shared/form/form.module';

const DECLARATIONS = [
  BrowseBySwitcherComponent,
];

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  BrowseByTitlePageComponent,
  BrowseByMetadataPageComponent,
  BrowseByDatePageComponent,
  BrowseByTaxonomyPageComponent,
];

@NgModule({
  imports: [
    SharedBrowseByModule,
    CommonModule,
    DsoPageModule,
    FormModule,
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
