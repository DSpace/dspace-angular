import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { RootModule } from '../../app/root.module';

const DECLARATIONS = [
];

@NgModule({
  imports: [
    RootModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    ScrollToModule,
    StoreModule,
    StoreRouterConnectingModule,
    TranslateModule,
    FormsModule,
  ],
  declarations: DECLARATIONS,
})

/**
 * This module serves as an index for all the components in this theme.
 * It should import all other modules, so the compiler knows where to find any components referenced
 * from a component in this theme
 * It is purposefully not exported, it should never be imported anywhere else, its only purpose is
 * to give lazily loaded components a context in which they can be compiled successfully
 */
class LazyThemeModule {
}
