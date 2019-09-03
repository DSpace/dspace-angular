import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { debounceTime, map, mergeMap, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { RelationshipAction, RelationshipActionTypes } from './relationship.actions';
import { Item } from '../../../../../core/shared/item.model';
import { hasNoValue, hasValueOperator } from '../../../../empty.util';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';

const DEBOUNCE_TIME = 5000;

/**
 * NGRX effects for RelationshipEffects
 */
@Injectable()
export class RelationshipEffects {
  /**
   * Map that keeps track of the latest RelationshipEffects for each relationship's composed identifier
   */
  private debounceMap: {
    [identifier: string]: BehaviorSubject<boolean>
  } = {};

  private initialStateMap: {
    [identifier: string]: boolean
  } = {};


  /**
   * Effect that makes sure all last fired ObjectUpdatesActions are stored in the map of this service, with the url as their key
   */
  @Effect({ dispatch: false }) mapLastActions$ = this.actions$
    .pipe(
      ofType(...Object.values(RelationshipActionTypes)),
      map((action: RelationshipAction) => {
          const { item1, item2, relationshipType } = action.payload;
          const identifier: string = this.createIdentifier(item1, item2, relationshipType);
          if (hasNoValue(this.debounceMap[identifier])) {
            this.initialStateMap[identifier] = !action.exists;
            this.debounceMap[identifier] = new BehaviorSubject<boolean>(action.exists);
            this.debounceMap[identifier].pipe(
              debounceTime(DEBOUNCE_TIME),
              take(1)
            ).subscribe(
              (exists) => {
                if (this.initialStateMap[identifier] !== exists) {
                  exists ? this.addRelationship(item1, item2, relationshipType) : this.removeRelationship(item1, item2, relationshipType);
                }
                delete this.debounceMap[identifier];
                delete this.initialStateMap[identifier];
              }
            )
          } else {
            this.debounceMap[identifier].next(action.exists);
          }
        }
      )
    );

  constructor(private actions$: Actions,
              private relationshipService: RelationshipService,
              private relationshipTypeService: RelationshipTypeService,
  ) {
  }


  private createIdentifier(item1: Item, item2: Item, relationshipType: string): string {
    return `${item1.uuid}-${item2.uuid}-${relationshipType}`;
  }


  private addRelationship(item1: Item, item2: Item, relationshipType: string) {
    const type1: string = item1.firstMetadataValue('relationship.type');
    // const type1: string = 'JournalVolume';
    const type2: string = item2.firstMetadataValue('relationship.type');
    return this.relationshipTypeService.getRelationshipTypeByLabelAndTypes(relationshipType, type1, type2)
      .pipe(
        mergeMap((type: RelationshipType) => {
            const isSwitched = type.rightLabel === relationshipType;
            if (isSwitched) {
              return this.relationshipService.addRelationship(type.id, item2, item1);
            } else {
              return this.relationshipService.addRelationship(type.id, item1, item2);
            }
          }
        )
      ).pipe(take(1))
      .subscribe();
  }

  private removeRelationship(item1: Item, item2: Item, relationshipType: string) {
    this.relationshipService.getRelationshipByItemsAndLabel(item1, item2, relationshipType).pipe(
      take(1),
      hasValueOperator(),
      mergeMap((relationship: Relationship) => this.relationshipService.deleteRelationship(relationship.id)),
      take(1)
    ).subscribe();
  }
}
