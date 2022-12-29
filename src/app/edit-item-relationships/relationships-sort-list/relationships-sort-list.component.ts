import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { BehaviorSubject } from 'rxjs';

import { Context } from '../../core/shared/context.model';
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

  /**
   * When true disable drag & drop and hide handle
   */
  @Input() pendingChanges = false;

  @Output() itemDrop = new EventEmitter<any>();

  @Output() deleteRelationship = new EventEmitter<any>();

  context = Context.RelationshipItem;

  filteredRelationships: Relationship[];

  /**
   * A boolean representing if relationships are loading
   */
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  ngOnChanges(change) {
    if (change.relationships) {
      this.isLoading.next(true);
      this.filteredRelationships = this.relationships.filter((rel) => !rel.leftwardValue.includes('Hidden'));
      this.isLoading.next(false);
    }
  }

  drop(event: CdkDragDrop<any>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.itemDrop.emit({ relationship: event.container.data[event.currentIndex], place: event.currentIndex });
    }
  }


}
