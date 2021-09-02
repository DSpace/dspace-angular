import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { VersionHistoryRoutingModule } from './version-history.routing.module';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemVersionHistoryEditComponent } from './item-version-history-edit/item-version-history-edit.component';

@NgModule({
  declarations: [
    ItemVersionHistoryComponent,
    ItemVersionHistoryEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VersionHistoryRoutingModule
  ]
})
export class VersionHistoryModule {
}
