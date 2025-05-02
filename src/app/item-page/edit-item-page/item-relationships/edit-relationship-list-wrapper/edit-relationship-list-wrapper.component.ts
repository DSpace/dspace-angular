import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { hasValue } from '../../../../shared/empty.util';
import { EditItemRelationshipsService } from '../edit-item-relationships.service';
import { EditRelationshipListComponent } from '../edit-relationship-list/edit-relationship-list.component';

@Component({
  selector: 'ds-edit-relationship-list-wrapper',
  styleUrls: ['./edit-relationship-list-wrapper.component.scss'],
  templateUrl: './edit-relationship-list-wrapper.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    EditRelationshipListComponent,
  ],
})
/**
 * A component creating a list of editable relationships of a certain type
 * The relationships are rendered as a list of related items
 */
export class EditRelationshipListWrapperComponent implements OnInit, OnDestroy {

  /**
   * The item to display related items for
   */
  @Input() item: Item;

  @Input() itemType: ItemType;

  /**
   * The URL to the current page
   * Used to fetch updates for the current item from the store
   */
  @Input() url: string;

  /**
   * The label of the relationship-type we're rendering a list for
   */
  @Input() relationshipType: RelationshipType;

  /**
   * If updated information has changed
   */
  @Input() hasChanges!: Observable<boolean>;

  /**
   * The event emmiter to submit the new information
   */
  @Output() submitModal: EventEmitter<void> = new EventEmitter();

  /**
   * Observable that emits true if {@link itemType} is on the left-hand side of {@link relationshipType},
   * false if it is on the right-hand side and undefined in the rare case that it is on neither side.
   */
  currentItemIsLeftItem$: BehaviorSubject<boolean> = new BehaviorSubject(undefined);


  isLeftItem$ = new BehaviorSubject(true);

  isRightItem$ = new BehaviorSubject(false);

  shouldDisplayBothRelationshipSides$: Observable<boolean>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(
    protected editItemRelationshipsService: EditItemRelationshipsService,
  ) {
  }


  ngOnInit(): void {
    this.subs.push(this.editItemRelationshipsService.isProvidedItemTypeLeftType(this.relationshipType, this.itemType, this.item)
      .subscribe((nextValue: boolean) => {
        this.currentItemIsLeftItem$.next(nextValue);
      }));

    this.shouldDisplayBothRelationshipSides$ = this.editItemRelationshipsService.shouldDisplayBothRelationshipSides(this.relationshipType, this.itemType);
  }


  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
