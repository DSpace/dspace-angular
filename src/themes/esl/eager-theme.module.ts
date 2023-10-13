import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemPageModule } from '../../app/item-page/item-page.module';
import { ItemSharedModule } from '../../app/item-page/item-shared.module';
import { ItemVersionsModule } from '../../app/item-page/versions/item-versions.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { RootModule } from '../../app/root.module';
import { SharedBrowseByModule } from '../../app/shared/browse-by/shared-browse-by.module';
import { DsoPageModule } from '../../app/shared/dso-page/dso-page.module';
import { ResultsBackButtonModule } from '../../app/shared/results-back-button/results-back-button.module';
import { SharedModule } from '../../app/shared/shared.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { FullItemPageComponent } from './app/item-page/full/full-item-page.component';
import { UntypedItemComponent } from './app/item-page/simple/item-types/untyped-item/untyped-item.component';

/**
 * Add components that use a custom decorator to ENTRY_COMPONENTS as well as DECLARATIONS.
 * This will ensure that decorator gets picked up when the app loads
 */
const ENTRY_COMPONENTS = [
  UntypedItemComponent,
  FullItemPageComponent
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedBrowseByModule,
    ResultsBackButtonModule,
    RootModule,
    NavbarModule,
    ItemPageModule,
    ItemSharedModule,
    ItemVersionsModule,
    DsoPageModule,
    StatisticsModule,
  ],
  declarations: DECLARATIONS,
  providers: [
    ...ENTRY_COMPONENTS.map((component) => ({ provide: component }))
  ],
})
/**
 * This module is included in the main bundle that gets downloaded at first page load. So it should
 * contain only the themed components that have to be available immediately for the first page load,
 * and the minimal set of imports required to make them work. Anything you can cut from it will make
 * the initial page load faster, but may cause the page to flicker as components that were already
 * rendered server side need to be lazy-loaded again client side
 *
 * Themed EntryComponents should also be added here
 */
export class EagerThemeModule {
}
