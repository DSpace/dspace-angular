import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Context } from '../../core/shared/context.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { Relationship } from '../../core/shared/item-relationships/relationship.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-relationships-sort-list',
  templateUrl: './relationships-sort-list.component.html',
  styleUrls: ['./relationships-sort-list.component.scss']
})
export class RelationshipsSortListComponent implements OnChanges {

  @Input() relationships: Relationship[];

  @Input() item: Item;

  @Output() itemDrop  = new EventEmitter<any>();

  @Output() deleteRelationship  = new EventEmitter<any>();

  context = Context.RelationshipItem;

  filteredRelationships: Relationship[] = [];


  ngOnChanges(change) {
    if (change.relationships) {
      this.filteredRelationships = this.relationships.filter((rel) => !rel.leftwardValue.includes('Hidden'));
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.itemDrop.emit({relationship: event.container.data[event.currentIndex], place:event.currentIndex});
  }


}
