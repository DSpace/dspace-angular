import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { map, take } from 'rxjs/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ds-relationships-items-actions',
  templateUrl: './relationships-items-actions.component.html',
  styleUrls: ['./relationships-items-actions.component.scss']
})
export class RelationshipsItemsActionsComponent implements OnInit,OnDestroy {

  /**
   * The Item object
   */
  @Input() object: Item;

  /**
   * Emit when one of the listed object has changed.
   */
  @Output() processCompleted = new EventEmitter<any>();

  /**
   * Pass custom data to the component for custom utilization
   */
  @Input() customData: any;

  /**
   * If this item exists in the selected relation
   */
  isSelected: Relationship;

  /**
   * If this item exists in the hidden relation
   */
  isHidden: Relationship;

  /**
   * The subscription to be unsubscribed
   */
  sub: Subscription;

  /**
   * Subscribe to the relationships list
   */
  ngOnInit(): void {
    this.sub = this.customData.relationships$.subscribe( (relationships) => {
      this.getSelected(relationships);
      this.getHidden(relationships);
    });
  }

  /**
   * When a button is clicked emit the event in the parent components
   */
  emitAction(action): void {
    let relationship = {};
    if ( action === 'unselect' ) {
      relationship = this.isSelected;
    } else if ( action === 'unhide' ) {
      relationship = this.isHidden;
    }
    this.processCompleted.emit({ action: action, item: this.object, relationship: relationship });
  }

  /**
   * Check the list of relationships and find the selected relationship of this item
   */
  getSelected(relationships): void {

    this.isSelected = null;
    const relationshipType = this.customData.entityType;

    relationships.forEach( relation => {
      relation.leftItem.pipe(
        map((itemRd: RemoteData<Item>) => itemRd.payload),
        take(1)
      ).subscribe( (item: Item) => {
        if (relation.leftwardValue.toLowerCase().includes('select') && relation.leftwardValue.toLowerCase().includes(relationshipType) && this.object.uuid === item.uuid) {
          this.isSelected = relation;
        }
      });

    });

  }

  /**
   * Check the list of relationships and find the hidden relationship of this item
   */
  getHidden(relationships): void {

    this.isHidden = null;
    const relationshipType = this.customData.entityType;

    relationships.forEach( relation => {
      relation.leftItem.pipe(
        map((itemRd: RemoteData<Item>) => itemRd.payload),
        take(1)
      ).subscribe( (item: Item) => {
        if (relation.leftwardValue.toLowerCase().includes('hidden') && relation.leftwardValue.toLowerCase().includes(relationshipType) && this.object.uuid === item.uuid) {
          this.isHidden = relation;
        }
      });

    });

  }

  /**
   * On destroy unsubscribe
   */
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
