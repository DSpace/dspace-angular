import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../../../empty.util';
import { filter, map, take } from 'rxjs/operators';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { ItemMetadataRepresentation } from '../../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { RemoveRelationshipAction } from '../relation-lookup-modal/relationship.actions';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app.reducer';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';

@Component({
  selector: 'ds-existing-metadata-list-element',
  templateUrl: './existing-metadata-list-element.component.html',
  styleUrls: ['./existing-metadata-list-element.component.scss']
})
export class ExistingMetadataListElementComponent implements OnChanges {
  @Input() listId: string;
  @Input() submissionItem: Item;
  @Input() relationship: Relationship;
  @Input() metadataFields: string[];
  @Input() relationshipOptions: RelationshipOptions;
  metadataRepresentation$;
  relatedItem$;

  constructor(
    private selectableListService: SelectableListService,
    private store: Store<AppState>
  ) {
  }

  ngOnChanges() {
    const leftItem$ = this.relationship.leftItem.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      filter((item: Item) => hasValue(item) && isNotEmpty(item.uuid))
    );

    const rightItem$ = this.relationship.rightItem.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      filter((item: Item) => hasValue(item) && isNotEmpty(item.uuid))
    );

    this.relatedItem$ = observableCombineLatest(
      leftItem$,
      rightItem$,
    ).pipe(
      map((items: Item[]) =>
        items.find((item) => item.uuid !== this.submissionItem.uuid)
      )
    );

    this.metadataRepresentation$ = this.relatedItem$.pipe(
      map((relatedItem: Item) => {
        console.log(relatedItem);
          const relationMD: MetadataValue = this.submissionItem.firstMetadata(this.relationshipOptions.metadataField, { value: relatedItem.uuid });
          console.log(relationMD);
          if (hasValue(relationMD)) {
            const metadataRepresentationMD: MetadataValue = this.submissionItem.firstMetadata(this.metadataFields, { authority: relationMD.authority });
            return Object.assign(
              new ItemMetadataRepresentation(metadataRepresentationMD),
              relatedItem
            )
          }
        }
      )
    );
  }

  removeSelection() {
    this.relatedItem$.pipe(take(1)).subscribe((relatedItem: Item) => {
      this.selectableListService.deselectSingle(this.listId, Object.assign(new ItemSearchResult(), { indexableObject: relatedItem }));
      this.store.dispatch(new RemoveRelationshipAction(this.submissionItem, relatedItem, this.relationshipOptions.relationshipType))
    })
  }
}
