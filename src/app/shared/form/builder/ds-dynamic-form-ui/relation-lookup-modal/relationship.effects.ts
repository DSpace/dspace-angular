import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { debounceTime, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../../core/shared/operators';
import { AddRelationshipAction, RelationshipAction, RelationshipActionTypes, UpdateRelationshipAction } from './relationship.actions';
import { Item } from '../../../../../core/shared/item.model';
import { hasNoValue, hasValue, hasValueOperator } from '../../../../empty.util';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { SubmissionObjectDataService } from '../../../../../core/submission/submission-object-data.service';
import { SaveSubmissionSectionFormSuccessAction } from '../../../../../submission/objects/submission-objects.actions';
import { SubmissionObject } from '../../../../../core/submission/models/submission-object.model';
import { SubmissionState } from '../../../../../submission/submission.reducers';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../../../../../core/cache/object-cache.service';
import { RequestService } from '../../../../../core/data/request.service';

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
    [identifier: string]: BehaviorSubject<string>
  } = {};

  private nameVariantUpdates: {
    [identifier: string]: string
  } = {};

  private initialActionMap: {
    [identifier: string]: string
  } = {};

  /**
   * Effect that makes sure all last fired RelationshipActions' types are stored in the map of this service, with the object uuid as their key
   */
  @Effect({ dispatch: false }) mapLastActions$ = this.actions$
    .pipe(
      ofType(RelationshipActionTypes.ADD_RELATIONSHIP, RelationshipActionTypes.REMOVE_RELATIONSHIP),
      map((action: RelationshipAction) => {
          const { item1, item2, submissionId, relationshipType } = action.payload;
          const identifier: string = this.createIdentifier(item1, item2, relationshipType);
          if (hasNoValue(this.debounceMap[identifier])) {
            this.initialActionMap[identifier] = action.type;
            this.debounceMap[identifier] = new BehaviorSubject<string>(action.type);
            this.debounceMap[identifier].pipe(
              debounceTime(DEBOUNCE_TIME),
              take(1)
            ).subscribe(
              (type) => {
                if (this.initialActionMap[identifier] === type) {
                  if (type === RelationshipActionTypes.ADD_RELATIONSHIP) {
                    let nameVariant = (action as AddRelationshipAction).payload.nameVariant;
                    if (hasValue(this.nameVariantUpdates[identifier])) {
                      nameVariant = this.nameVariantUpdates[identifier];
                      delete this.nameVariantUpdates[identifier];
                    }
                    this.addRelationship(item1, item2, relationshipType, submissionId, nameVariant);
                  } else {
                    this.removeRelationship(item1, item2, relationshipType, submissionId);
                  }

                }
                delete this.debounceMap[identifier];
                delete this.initialActionMap[identifier];

              }
            )
          } else {
            this.debounceMap[identifier].next(action.type);
          }
        }
      )
    );

  /**
   * Updates the namevariant in a relationship
   * If the relationship is currently being added or removed, it will add the name variant to an update map so it will be sent with the next add request instead
   * Otherwise the update is done immediately
   */
  @Effect({ dispatch: false }) updateNameVariantsActions$ = this.actions$
    .pipe(
      ofType(RelationshipActionTypes.UPDATE_RELATIONSHIP),
      map((action: UpdateRelationshipAction) => {
          const { item1, item2, relationshipType, nameVariant } = action.payload;
          const identifier: string = this.createIdentifier(item1, item2, relationshipType);
          const inProgress = hasValue(this.debounceMap[identifier]);
          if (inProgress) {
            this.nameVariantUpdates[identifier] = nameVariant;
          } else {
            this.relationshipService.updateNameVariant(item1, item2, relationshipType, nameVariant)
              .subscribe();
          }
        }
      )
    );

  constructor(private actions$: Actions,
              private relationshipService: RelationshipService,
              private relationshipTypeService: RelationshipTypeService,
              private submissionObjectService: SubmissionObjectDataService,
              private store: Store<SubmissionState>,
              private objectCache: ObjectCacheService,
              private requestService: RequestService
  ) {
  }

  private createIdentifier(item1: Item, item2: Item, relationshipType: string): string {
    return `${item1.uuid}-${item2.uuid}-${relationshipType}`;
  }

  private addRelationship(item1: Item, item2: Item, relationshipType: string, submissionId: string, nameVariant?: string) {
    const type1: string = item1.firstMetadataValue('relationship.type');
    const type2: string = item2.firstMetadataValue('relationship.type');
    return this.relationshipTypeService.getRelationshipTypeByLabelAndTypes(relationshipType, type1, type2)
      .pipe(
        mergeMap((type: RelationshipType) => {
            const isSwitched = type.rightwardType === relationshipType;
            if (isSwitched) {
              return this.relationshipService.addRelationship(type.id, item2, item1, nameVariant, undefined);
            } else {
              return this.relationshipService.addRelationship(type.id, item1, item2, undefined, nameVariant);
            }
          }
        ),
        take(1),
        this.removeWorkspaceItemFromCache(submissionId)
      ).subscribe((submissionObject: SubmissionObject) => this.store.dispatch(new SaveSubmissionSectionFormSuccessAction(submissionId, [submissionObject], false)));
  }

  private removeRelationship(item1: Item, item2: Item, relationshipType: string, submissionId: string) {
    this.relationshipService.getRelationshipByItemsAndLabel(item1, item2, relationshipType).pipe(
      take(1),
      hasValueOperator(),
      mergeMap((relationship: Relationship) => this.relationshipService.deleteRelationship(relationship.id)),
      take(1),
      this.removeWorkspaceItemFromCache(submissionId)
    ).subscribe((submissionObject: SubmissionObject) => this.store.dispatch(new SaveSubmissionSectionFormSuccessAction(submissionId, [submissionObject], false)));
  }

  removeWorkspaceItemFromCache = (submissionId) =>
    <T>(source: Observable<T>): Observable<SubmissionObject> =>
      source.pipe(
        switchMap(() => this.submissionObjectService.getHrefByID(submissionId).pipe(take(1))),
        switchMap((href: string) => {
            this.objectCache.remove(href);
            this.requestService.removeByHrefSubstring(submissionId);
            return combineLatest(
              this.objectCache.hasBySelfLinkObservable(href),
              this.requestService.hasByHrefObservable(href)
            ).pipe(
              filter(([existsInOC, existsInRC]) => !existsInOC && !existsInRC),
              take(1),
              switchMap(() => this.submissionObjectService.findById(submissionId).pipe(getSucceededRemoteData(), getRemoteDataPayload()) as Observable<SubmissionObject>)
            )
          }
        ));
}
