import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { Context } from '../../core/shared/context.model';
import { Item } from '../../core/shared/item.model';
import { Relationship } from '../../core/shared/item-relationships/relationship.model';
import { AlertComponent } from '../../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { RelationshipsItemsListPreviewComponent } from '../../shared/object-list/relationships-list/relationships-items-list-preview/relationships-items-list-preview.component';

@Component({
  selector: 'ds-relationships-sort-list',
  templateUrl: './relationships-sort-list.component.html',
  styleUrls: ['./relationships-sort-list.component.scss'],
  imports: [
    CdkDropListGroup,
    ThemedLoadingComponent,
    NgIf,
    CdkDropList,
    AsyncPipe,
    TranslateModule,
    RelationshipsItemsListPreviewComponent,
    CdkDrag,
    AlertComponent,
    NgForOf,
  ],
  standalone: true,
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
