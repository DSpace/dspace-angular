import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { VersionHistoryRoutingModule } from './version-history.routing.module';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemVersionHistoryFormComponent } from './item-version-history-form/item-version-history-form.component';

@NgModule({
  declarations: [
    ItemVersionHistoryComponent,
    ItemVersionHistoryFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VersionHistoryRoutingModule
  ]
})
export class VersionHistoryModule {
}
