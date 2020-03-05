import { Component, Input, OnInit } from '@angular/core';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { Observable } from 'rxjs/internal/Observable';
import {FieldUpdate, FieldUpdates} from '../../../../core/data/object-updates/object-updates.reducer';
import {Item} from '../../../../core/shared/item.model';
import { map, switchMap, tap } from 'rxjs/operators';
import {hasValue} from '../../../../shared/empty.util';
import {Relationship} from '../../../../core/shared/item-relationships/relationship.model';
import {RelationshipType} from '../../../../core/shared/item-relationships/relationship-type.model';
import {
  getAllSucceededRemoteData,
  getRemoteDataPayload,
  getSucceededRemoteData
} from '../../../../core/shared/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';

@Component({
  selector: 'ds-edit-relationship-list',
  styleUrls: ['./edit-relationship-list.component.scss'],
  templateUrl: './edit-relationship-list.component.html',
})
/**
 * A component creating a list of editable relationships of a certain type
 * The relationships are rendered as a list of related items
 */
export class EditRelationshipListComponent implements OnInit {

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
   * The FieldUpdates for the relationships in question
   */
  updates$: Observable<FieldUpdates>;

  constructor(
    protected objectUpdatesService: ObjectUpdatesService,
    protected linkService: LinkService
  ) {
  }

  /**
   * Get the i18n message key for this relationship type
   */
  public getRelationshipMessageKey(): Observable<string> {

    return this.getLabel().pipe(
      map((label) => {
        if (hasValue(label) && label.indexOf('Of') > -1) {
          return `relationships.${label.substring(0, label.indexOf('Of') + 2)}`
        } else {
          return label;
        }
      }),
    );
  }

  /**
   * Get the relevant label for this relationship type
   */
  private getLabel(): Observable<string> {

    return observableCombineLatest([
      this.relationshipType.leftType,
      this.relationshipType.rightType,
    ].map((itemTypeRD) => itemTypeRD.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
    ))).pipe(
      map((itemTypes) => [
        this.relationshipType.leftwardType,
        this.relationshipType.rightwardType,
      ][itemTypes.findIndex((itemType) => itemType.id === this.itemType.id)]),
    );
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackUpdate(index, update: FieldUpdate) {
    return update && update.field ? update.field.uuid : undefined;
  }

  ngOnInit(): void {
    this.updates$ = this.item.relationships.pipe(
      getAllSucceededRemoteData(),
      map((relationships) => relationships.payload.page.filter((relationship) => relationship)),
      map((relationships: Relationship[]) =>
        relationships.map((relationship: Relationship) => {
          this.linkService.resolveLinks(
            relationship,
            followLink('relationshipType'),
            followLink('leftItem'),
            followLink('rightItem'),
          );
          return relationship;
        })
      ),
      switchMap((itemRelationships: Relationship[]) =>
        observableCombineLatest(
          itemRelationships
            .map((relationship) => relationship.relationshipType.pipe(
              getSucceededRemoteData(),
              getRemoteDataPayload(),
            ))
        ).pipe(
          map((relationshipTypes) => itemRelationships.filter(
            (relationship, index) => relationshipTypes[index].id === this.relationshipType.id)
          ),
          map((relationships) => relationships.map((relationship) =>
            Object.assign(new Relationship(), relationship, {uuid: relationship.id})
          )),
        )
      ),
      switchMap((initialFields) => this.objectUpdatesService.getFieldUpdates(this.url, initialFields)),
    );
  }
}
