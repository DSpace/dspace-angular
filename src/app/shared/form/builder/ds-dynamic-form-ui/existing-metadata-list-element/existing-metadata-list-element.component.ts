import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { MetadataRepresentation } from '../../../../../core/shared/metadata-representation/metadata-representation.model';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../../../empty.util';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { ItemMetadataRepresentation } from '../../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { RemoveRelationshipAction } from '../relation-lookup-modal/relationship.actions';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';

// tslint:disable:max-classes-per-file
/**
 * Abstract class that defines objects that can be reordered
 */
export abstract class Reorderable {
  constructor(public oldIndex?: number, public newIndex?: number) {
  }

  abstract getId(): string;

  abstract getPlace(): number;
}

/**
 * Represents a single relationship that can be reordered in a list of multiple relationships
 */
export class ReorderableRelationship extends Reorderable {
  relationship: Relationship;
  useLeftItem: boolean;

  constructor(relationship: Relationship, useLeftItem: boolean, oldIndex?: number, newIndex?: number) {
    super(oldIndex, newIndex);
    this.relationship = relationship;
    this.useLeftItem = useLeftItem;
  }

  getId(): string {
    return this.relationship.id;
  }

  getPlace(): number {
    if (this.useLeftItem) {
      return this.relationship.rightPlace
    } else {
      return this.relationship.leftPlace
    }
  }
}

/**
 * Represents a single existing relationship value as metadata in submission
 */
@Component({
  selector: 'ds-existing-metadata-list-element',
  templateUrl: './existing-metadata-list-element.component.html',
  styleUrls: ['./existing-metadata-list-element.component.scss']
})
export class ExistingMetadataListElementComponent implements OnChanges, OnDestroy {
  @Input() listId: string;
  @Input() submissionItem: Item;
  @Input() reoRel: ReorderableRelationship;
  @Input() metadataFields: string[];
  @Input() relationshipOptions: RelationshipOptions;
  metadataRepresentation: MetadataRepresentation;
  relatedItem: Item;

  /**
   * List of subscriptions to unsubscribe from
   */
  private subs: Subscription[] = [];

  constructor(
    private selectableListService: SelectableListService,
    private store: Store<AppState>
  ) {
  }

  ngOnChanges() {
    const item$ = this.reoRel.useLeftItem ?
      this.reoRel.relationship.leftItem : this.reoRel.relationship.rightItem;
    this.subs.push(item$.pipe(
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      filter((item: Item) => hasValue(item) && isNotEmpty(item.uuid))
    ).subscribe((item: Item) => {
      this.relatedItem = item;
      const relationMD: MetadataValue = this.submissionItem.firstMetadata(this.relationshipOptions.metadataField, { value: this.relatedItem.uuid });
      if (hasValue(relationMD)) {
        const metadataRepresentationMD: MetadataValue = this.submissionItem.firstMetadata(this.metadataFields, { authority: relationMD.authority });
        this.metadataRepresentation = Object.assign(
          new ItemMetadataRepresentation(metadataRepresentationMD),
          this.relatedItem
        )
      }
    }));
  }

  /**
   * Removes the selected relationship from the list
   */
  removeSelection() {
    this.selectableListService.deselectSingle(this.listId, Object.assign(new ItemSearchResult(), { indexableObject: this.relatedItem }));
    this.store.dispatch(new RemoveRelationshipAction(this.submissionItem, this.relatedItem, this.relationshipOptions.relationshipType))
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
// tslint:enable:max-classes-per-file
