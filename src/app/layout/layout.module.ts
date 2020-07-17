import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { CrisPageLoaderComponent } from './cris-page-loader.component';
import { CrisLayoutDefaultComponent } from './default-layout/cris-layout-default.component';
import { CrisLayoutDefaultSidebarComponent } from './default-layout/sidebar/cris-layout-default-sidebar.component';
import { CrisLayoutDefaultTabComponent } from './default-layout/tab/cris-layout-default-tab.component';
import { CrisLayoutMetadataBoxComponent } from './default-layout/boxes/metadata/cris-layout-metadata-box.component';
import { RowComponent } from './default-layout/boxes/components/row/row.component';
import { TextComponent } from './default-layout/boxes/components/text/text.component';
import { HeadingComponent } from './default-layout/boxes/components/heading/heading.component';
import { CrisLayoutSearchBoxComponent } from './default-layout/boxes/search/cris-layout-search-box.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { WorkspaceItemSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workspace-item-search-result/workspace-item-search-result-list-element.component';
import { MyDSpacePageModule } from '../+my-dspace-page/my-dspace-page.module';

@NgModule({
  declarations: [
    CrisLayoutLoaderDirective,
    CrisPageLoaderComponent,
    CrisLayoutDefaultSidebarComponent,
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent,
    RowComponent,
    TextComponent,
    HeadingComponent,
    CrisLayoutSearchBoxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SearchPageModule,
    MyDSpacePageModule
  ],
  entryComponents: [
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent,
    CrisLayoutSearchBoxComponent,
    TextComponent,
    HeadingComponent
  ],
  exports: [
    CrisPageLoaderComponent,
    CrisLayoutDefaultComponent,
    CrisLayoutDefaultTabComponent,
    CrisLayoutMetadataBoxComponent
  ]
})
export class LayoutModule { }
