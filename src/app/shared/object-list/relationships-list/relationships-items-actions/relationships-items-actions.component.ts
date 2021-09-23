import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RemoteData } from '../../../../core/data/remote-data';
import {
  getFirstSucceededRemoteDataPayload,
} from '../../../../core/shared/operators';

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

  isProcessingHide = false;
  isProcessingSelect = false;
  isProcessingUnhide = false;
  isProcessingUnselect = false;

  /**
   * Subscribe to the relationships list
   */
  ngOnInit(): void {
    if (!!this.customData && !!this.customData.relationships$) {
      this.sub = this.customData.relationships$.subscribe( (relationships) => {
        this.getSelected(relationships);
        this.getHidden(relationships);
        this.isProcessingHide = false;
        this.isProcessingSelect = false;
        this.isProcessingUnhide = false;
        this.isProcessingUnselect = false;
      });
    }
  }

  /**
   * When a button is clicked emit the event in the parent components
   */
  emitAction(action): void {
    this.setProcessing(action);
    let relationship = null;
    if ( !!this.isSelected ) {
      relationship = this.isSelected;
    } else if ( !!this.isHidden ) {
      relationship = this.isHidden;
    }
    this.processCompleted.emit({ action: action, item: this.object, relationship: relationship });
  }

  private setProcessing(action: string): void {
    switch (action) {
      case 'hide':
        this.isProcessingHide = true;
        break;
      case 'select':
        this.isProcessingSelect = true;
        break;
      case 'unhide':
        this.isProcessingUnhide = true;
        break;
      case 'unselect':
        this.isProcessingUnselect = true;
        break;
    }
  }

  /**
   * Check the list of relationships and find the selected relationship of this item
   */
  getSelected(relationships): void {

    this.isSelected = null;
    const relationshipType = this.customData.entityType;
    relationships.forEach( relation => {
      relation.leftItem.pipe(
        getFirstSucceededRemoteDataPayload(),
      ).subscribe( (item: Item) => {
        if (relation.leftwardValue.toLowerCase().includes('select') && relation.leftwardValue.toLowerCase().includes('is' + relationshipType) && this.object.uuid === item.uuid) {
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
        getFirstSucceededRemoteDataPayload(),
      ).subscribe( (item: Item) => {
        if (relation.leftwardValue.toLowerCase().includes('hidden') && relation.leftwardValue.toLowerCase().includes('is' + relationshipType) && this.object.uuid === item.uuid) {
          this.isHidden = relation;
        }
      });

    });

  }

  isProcessing(): boolean {
    return this.isProcessingHide || this.isProcessingSelect || this.isProcessingUnhide || this.isProcessingUnselect;
  }

  /**
   * On destroy unsubscribe
   */
  ngOnDestroy(): void {
    if (!!this.sub) {
      this.sub.unsubscribe();
    }
  }

}
