import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { SharedModule } from '../shared/shared.module';
import { EditItemRelationshipsRoutingModule } from './edit-item-relationships-routing.module';
import { RelationshipsSortListComponent } from './relationships-sort-list/relationships-sort-list.component';


@NgModule({
  declarations: [EditItemRelationshipsComponent, RelationshipsSortListComponent],
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    EditItemRelationshipsRoutingModule
  ]
})
export class EditItemRelationshipsModule { }
