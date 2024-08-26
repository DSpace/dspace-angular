import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { EditItemRelationshipsRoutingModule } from './edit-item-relationships-routing.module';
import { RelationshipsSortListComponent } from './relationships-sort-list/relationships-sort-list.component';


@NgModule({
  declarations: [EditItemRelationshipsComponent, RelationshipsSortListComponent],
  imports: [
    CommonModule,
    EditItemRelationshipsRoutingModule,
  ],
})
export class EditItemRelationshipsModule { }
