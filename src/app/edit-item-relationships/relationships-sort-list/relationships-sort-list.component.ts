import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
export class RelationshipsSortListComponent implements OnInit {

  @Input() relationships: Relationship[];

  @Input() item: Item;

  @Output() itemDrop  = new EventEmitter<any>();

  context: string;

  ngOnInit(): void {
    this.context = Context.RelationshipItem;
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.itemDrop.emit({relationship: event.container.data[event.currentIndex], place:event.currentIndex});
  }


}
