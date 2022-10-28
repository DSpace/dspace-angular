import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { getFirstSucceededRemoteDataPayload, } from '../../../../core/shared/operators';
import { AppState } from '../../../../app.reducer';
import {
  ManageRelationshipCustomData,
  ManageRelationshipEvent,
  ManageRelationshipEventType
} from '../../../../edit-item-relationships/edit-item-relationships.component';
import { getPendingStatus } from '../../../../edit-item-relationships/edit-item-relationships.selectors';
import { hasValue } from '../../../empty.util';

@Component({
  selector: 'ds-relationships-items-actions',
  templateUrl: './relationships-items-actions.component.html',
  styleUrls: ['./relationships-items-actions.component.scss']
})
export class RelationshipsItemsActionsComponent implements OnInit, OnDestroy {

  /**
   * The Item object
   */
  @Input() object: Item;

  /**
   * Pass custom data to the component for custom utilization
   */
  @Input() customData: ManageRelationshipCustomData;

  /**
   * If this item exists in the selected relation
   */
  isSelected: BehaviorSubject<Relationship> = new BehaviorSubject<Relationship>(null);

  /**
   * If this item exists in the hidden relation
   */
  isHidden: BehaviorSubject<Relationship> = new BehaviorSubject<Relationship>(null);

  /**
   * The subscription list to be unsubscribed
   */
  subs: Subscription[] = [];

  /**
   * Representing if a hiding action is processing
   */
  isProcessingHide: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Representing if a selecting action is processing
   */
  isProcessingSelect: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Representing if an unhiding action is processing
   */
  isProcessingUnhide: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Representing if an unselecting action is processing
   */
  isProcessingUnselect: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Representing if any action is processing in the page result list
   */
  pendingChanges$: Observable<boolean>;

  /**
   * Emit when one of the listed object has changed.
   */
  @Output() processCompleted = new EventEmitter<ManageRelationshipEvent>();

  constructor(
    protected store: Store<AppState>,
  ) {
  }

  /**
   * Subscribe to the relationships list
   */
  ngOnInit(): void {
    this.pendingChanges$ = this.store.pipe(
      select(getPendingStatus),
      map(pendingChanges =>
        pendingChanges ||
        this.isProcessingHide.value ||
        this.isProcessingSelect.value ||
        this.isProcessingUnhide.value ||
        this.isProcessingUnselect.value
      )
    );

    if (!!this.customData) {
      if (!!this.customData.relationships$) {
        this.subs.push(
          this.customData.relationships$.subscribe((relationships) => {
            this.getSelected(relationships);
            this.getHidden(relationships);
          })
        );
      }
      if (!!this.customData.updateStatusByItemId$) {
        this.subs.push(
          this.customData.updateStatusByItemId$.subscribe((itemId?: string) => {
            if (!itemId || this.object.id === itemId) {
              this.isProcessingHide.next(false);
              this.isProcessingSelect.next(false);
              this.isProcessingUnhide.next(false);
              this.isProcessingUnselect.next(false);
            }
          })
        );
      }
    }
  }

  /**
   * When a button is clicked emit the event in the parent components
   */
  emitAction(action): void {
    this.setProcessing(action);
    let relationship = null;
    if (!!this.isSelected.value) {
      relationship = this.isSelected.value;
    } else if (!!this.isHidden.value) {
      relationship = this.isHidden.value;
    }
    this.processCompleted.emit({ action, item: this.object, relationship });
  }

  private setProcessing(action: ManageRelationshipEventType): void {
    switch (action) {
      case ManageRelationshipEventType.Hide:
        this.isProcessingHide.next(true);
        break;
      case ManageRelationshipEventType.Select:
        this.isProcessingSelect.next(true);
        break;
      case ManageRelationshipEventType.Unhide:
        this.isProcessingUnhide.next(true);
        break;
      case ManageRelationshipEventType.Unselect:
        this.isProcessingUnselect.next(true);
        break;
    }
  }

  /**
   * Check the list of relationships and find the selected relationship of this item
   */
  getSelected(relationships): void {

    this.isSelected.next(null);
    const relationshipType = this.customData.entityType;
    relationships.forEach(relation => {
      relation.leftItem.pipe(
        getFirstSucceededRemoteDataPayload(),
      ).subscribe((item: Item) => {
        if (relation.leftwardValue.toLowerCase().includes('select') &&
          relation.leftwardValue.toLowerCase().includes('is' + relationshipType) &&
          this.object.uuid === item.uuid
        ) {
          this.isSelected.next(relation);
        }
      });

    });

  }

  /**
   * Check the list of relationships and find the hidden relationship of this item
   */
  getHidden(relationships): void {

    this.isHidden.next(null);
    const relationshipType = this.customData.entityType;

    relationships.forEach(relation => {
      relation.leftItem.pipe(
        getFirstSucceededRemoteDataPayload(),
      ).subscribe((item: Item) => {
        if (relation.leftwardValue.toLowerCase().includes('hidden') &&
          relation.leftwardValue.toLowerCase().includes('is' + relationshipType) &&
          this.object.uuid === item.uuid
        ) {
          this.isHidden.next(relation);
        }
      });

    });

  }

  /**
   * On destroy unsubscribe
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
