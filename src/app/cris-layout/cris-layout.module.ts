import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { CrisLayoutComponent } from './cris-layout.component';
import { CrisLayoutLeadingComponent } from './cris-layout-leading/cris-layout-leading.component';
import { CrisLayoutLoaderComponent } from './cris-layout-loader/cris-layout-loader.component';
import { CrisLayoutMatrixComponent } from './cris-layout-matrix/cris-layout-matrix.component';
import { CrisLayoutVerticalComponent } from './cris-layout-loader/cris-layout-vertical/cris-layout-vertical.component';
import { CrisLayoutSidebarComponent } from './cris-layout-loader/cris-layout-vertical/cris-layout-sidebar/cris-layout-sidebar.component';
import { CrisLayoutHorizontalComponent } from './cris-layout-loader/cris-layout-horizontal/cris-layout-horizontal.component';
import { CrisLayoutNavbarComponent } from './cris-layout-loader/cris-layout-horizontal/cris-layout-navbar/cris-layout-navbar.component';
import { CrisLayoutSidebarItemComponent } from './cris-layout-loader/shared/sidebar-item/cris-layout-sidebar-item.component';
import { CrisLayoutTabsSidebarComponent } from './cris-layout-loader/shared/cris-layout-tabs/cris-layout-tabs.component';


const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  CrisLayoutLoaderComponent,
  CrisLayoutMatrixComponent,
  CrisLayoutVerticalComponent,
  CrisLayoutHorizontalComponent,
];
@NgModule({
  declarations: [
    CrisLayoutLoaderDirective,
    CrisLayoutComponent,
    CrisLayoutLeadingComponent,
    CrisLayoutLoaderComponent,
    CrisLayoutMatrixComponent,
    CrisLayoutVerticalComponent,
    CrisLayoutSidebarComponent,
    CrisLayoutHorizontalComponent,
    CrisLayoutNavbarComponent,
    CrisLayoutSidebarItemComponent,
    CrisLayoutTabsSidebarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    CrisLayoutComponent,
  ]
})
export class CrisLayoutModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: CrisLayoutModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
