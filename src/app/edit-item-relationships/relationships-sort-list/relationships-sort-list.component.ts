import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Context } from '../../core/shared/context.model';
import { Relationship } from '../../core/shared/item-relationships/relationship.model';
import { Item } from '../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ds-relationships-sort-list',
  templateUrl: './relationships-sort-list.component.html',
  styleUrls: ['./relationships-sort-list.component.scss']
})
export class RelationshipsSortListComponent implements OnChanges {

  @Input() relationships: Relationship[];

  @Input() item: Item;

  @Output() itemDrop = new EventEmitter<any>();

  @Output() deleteRelationship = new EventEmitter<any>();

  context = Context.RelationshipItem;

  filteredRelationships: Relationship[];

  /**
   * A boolean representing if relationships are loading
   */
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  ngOnChanges(change) {
    this.isLoading.next(true);
    console.log('ngOnChanges', change.relationships);
    if (change.relationships) {
      this.filteredRelationships = this.relationships.filter((rel) => !rel.leftwardValue.includes('Hidden'));
      console.log(this.filteredRelationships);
      this.isLoading.next(false);
    }

  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.itemDrop.emit({ relationship: event.container.data[event.currentIndex], place: event.currentIndex });
  }


}
