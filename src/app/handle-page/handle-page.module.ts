import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HandlePageComponent } from './handle-page.component';
import { HandlePageRoutingModule } from './handle-page.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HandleTableComponent } from './handle-table/handle-table.component';
import { HandleGlobalActionsComponent } from './handle-global-actions/handle-global-actions.component';
import { NewHandlePageComponent } from './new-handle-page/new-handle-page.component';
import { EditHandlePageComponent } from './edit-handle-page/edit-handle-page.component';
import { ChangeHandlePrefixPageComponent } from './change-handle-prefix-page/change-handle-prefix-page.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    HandlePageRoutingModule,
    TranslateModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    HandlePageComponent,
    HandleTableComponent,
    HandleGlobalActionsComponent,
    NewHandlePageComponent,
    EditHandlePageComponent,
    ChangeHandlePrefixPageComponent
  ]
})
/**
 * This module handles all components related to the access control pages
 */
export class HandlePageModule {

}
