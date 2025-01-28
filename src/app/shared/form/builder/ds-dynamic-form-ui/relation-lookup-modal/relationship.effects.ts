
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';
import {
  concatMap,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { ObjectCacheService } from '../../../../../core/cache/object-cache.service';
import { ServerSyncBufferActionTypes } from '../../../../../core/cache/server-sync-buffer.actions';
import { RelationshipDataService } from '../../../../../core/data/relationship-data.service';
import { RelationshipTypeDataService } from '../../../../../core/data/relationship-type-data.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { RequestService } from '../../../../../core/data/request.service';
import { JsonPatchOperationsActionTypes } from '../../../../../core/json-patch/json-patch-operations.actions';
import { Item } from '../../../../../core/shared/item.model';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import {
  DEBOUNCE_TIME_OPERATOR,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../../../core/shared/operators';
import { SubmissionObject } from '../../../../../core/submission/models/submission-object.model';
import { SubmissionObjectDataService } from '../../../../../core/submission/submission-object-data.service';
import { SaveSubmissionSectionFormSuccessAction } from '../../../../../submission/objects/submission-objects.actions';
import { SubmissionState } from '../../../../../submission/submission.reducers';
import {
  hasNoValue,
  hasValue,
  hasValueOperator,
} from '../../../../empty.util';
import { NotificationsService } from '../../../../notifications/notifications.service';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { followLink } from '../../../../utils/follow-link-config.model';
import {
  AddRelationshipAction,
  RelationshipAction,
  RelationshipActionTypes,
  UpdateRelationshipAction,
  UpdateRelationshipNameVariantAction,
} from './relationship.actions';

const DEBOUNCE_TIME = 500;

enum RelationOperationType {
  Add,
  Remove,
}

interface RelationOperation {
  type: RelationOperationType
  item1: Item
  item2: Item
  relationshipType: string
  submissionId: string
  nameVariant?: string
}

/**
 * NGRX effects for RelationshipEffects
 */
@Injectable()
export class RelationshipEffects {

  /**
   * Queue to hold all requests, so we can ensure they get sent one at a time
   */
  private requestQueue: Subject<RelationOperation> = new Subject();

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

  private updateAfterPatchSubmissionId: string;

  /**
   * Effect that makes sure all last fired RelationshipActions' types are stored in the map of this service, with the object uuid as their key
   */
  mapLastActions$ = createEffect(() => this.actions$
    .pipe(
      ofType(RelationshipActionTypes.ADD_RELATIONSHIP, RelationshipActionTypes.REMOVE_RELATIONSHIP),
      map((action: RelationshipAction) => {
        const { item1, item2, submissionId, relationshipType } = action.payload;
        const identifier: string = this.createIdentifier(item1, item2, relationshipType);
        if (hasNoValue(this.debounceMap[identifier])) {
          this.initialActionMap[identifier] = action.type;
          this.debounceMap[identifier] = new BehaviorSubject<string>(action.type);
          this.debounceMap[identifier].pipe(
            this.debounceTime(DEBOUNCE_TIME),
            take(1),
          ).subscribe(
            (type) => {
              if (this.initialActionMap[identifier] === type) {
                if (type === RelationshipActionTypes.ADD_RELATIONSHIP) {
                  let nameVariant = (action as AddRelationshipAction).payload.nameVariant;
                  if (hasValue(this.nameVariantUpdates[identifier])) {
                    nameVariant = this.nameVariantUpdates[identifier];
                    delete this.nameVariantUpdates[identifier];
                  }
                  this.requestQueue.next({
                    type: RelationOperationType.Add,
                    item1,
                    item2,
                    relationshipType,
                    submissionId,
                    nameVariant,
                  });
                } else {
                  this.requestQueue.next({
                    type: RelationOperationType.Remove,
                    item1,
                    item2,
                    relationshipType,
                    submissionId,
                  });
                }
              }
              delete this.debounceMap[identifier];
              delete this.initialActionMap[identifier];

            },
          );
        } else {
          this.debounceMap[identifier].next(action.type);
        }
      },
      ),
    ), { dispatch: false });

  /**
   * Updates the namevariant in a relationship
   * If the relationship is currently being added or removed, it will add the name variant to an update map so it will be sent with the next add request instead
   * Otherwise the update is done immediately
   */
  updateNameVariantsActions$ = createEffect(() => this.actions$
    .pipe(
      ofType(RelationshipActionTypes.UPDATE_NAME_VARIANT),
      map((action: UpdateRelationshipNameVariantAction) => {
        const { item1, item2, relationshipType, submissionId, nameVariant } = action.payload;
        const identifier: string = this.createIdentifier(item1, item2, relationshipType);
        const inProgress = hasValue(this.debounceMap[identifier]);
        if (inProgress) {
          this.nameVariantUpdates[identifier] = nameVariant;
        } else {
          this.relationshipService.updateNameVariant(item1, item2, relationshipType, nameVariant).pipe(
            filter((relationshipRD: RemoteData<Relationship>) => hasValue(relationshipRD.payload)),
            take(1),
          ).subscribe((c) => {
            this.updateAfterPatchSubmissionId = submissionId;
            this.relationshipService.refreshRelationshipItemsInCache(item1);
            this.relationshipService.refreshRelationshipItemsInCache(item2);
          });
        }
      },
      ),
    ), { dispatch: false });

  /**
   * Save the latest submission ID, to make sure it's updated when the patch is finished
   */
  updateRelationshipActions$ = createEffect(() => this.actions$
    .pipe(
      ofType(RelationshipActionTypes.UPDATE_RELATIONSHIP),
      map((action: UpdateRelationshipAction) => {
        this.updateAfterPatchSubmissionId = action.payload.submissionId;
      }),
    ), { dispatch: false });

  /**
   * Save the submission object with ID updateAfterPatchSubmissionId
   */
  saveSubmissionSection = createEffect(() => this.actions$
    .pipe(
      ofType(ServerSyncBufferActionTypes.EMPTY, JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS),
      filter(() => hasValue(this.updateAfterPatchSubmissionId)),
      switchMap(() => this.refreshWorkspaceItemInCache(this.updateAfterPatchSubmissionId)),
      map((submissionObject) => new SaveSubmissionSectionFormSuccessAction(this.updateAfterPatchSubmissionId, [submissionObject], false)),
    ));

  constructor(private actions$: Actions,
              private relationshipService: RelationshipDataService,
              private relationshipTypeService: RelationshipTypeDataService,
              private submissionObjectService: SubmissionObjectDataService,
              private store: Store<SubmissionState>,
              private objectCache: ObjectCacheService,
              private requestService: RequestService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private selectableListService: SelectableListService,
              @Inject(DEBOUNCE_TIME_OPERATOR) private debounceTime: <T>(dueTime: number) => (source: Observable<T>) => Observable<T>,
  ) {
    this.executeRequestsInQueue();
  }

  /**
   * Subscribe to the request queue, execute the requests inside. Wait for each request to complete
   * before sending the next one
   * @private
   */
  private executeRequestsInQueue() {
    this.requestQueue.pipe(
      // concatMap ensures the next request in the queue will only start after the previous one has emitted
      concatMap((next: RelationOperation) => {
        switch (next.type) {
          case RelationOperationType.Add:
            return this.addRelationship(next.item1, next.item2, next.relationshipType, next.submissionId, next.nameVariant).pipe(
              map(() => next),
            );
          case RelationOperationType.Remove:
            return this.removeRelationship(next.item1, next.item2, next.relationshipType).pipe(
              map(() => next),
            );
          default:
            return [next];
        }
      }),
      // refresh the workspaceitem after each request. It would be great if we could find a way to
      // optimize this so it only happens when the queue is empty.
      switchMap((next: RelationOperation) => this.refreshWorkspaceItemInCache(next.submissionId)),
      // update the form after the workspaceitem is refreshed
    ).subscribe((next: SubmissionObject) => {
      this.store.dispatch(new SaveSubmissionSectionFormSuccessAction(next.id, [next], false));
    });
  }


  private createIdentifier(item1: Item, item2: Item, relationshipType: string): string {
    return `${item1.uuid}-${item2.uuid}-${relationshipType}`;
  }

  private addRelationship(item1: Item, item2: Item, relationshipType: string, submissionId: string, nameVariant?: string) {
    const type1: string = item1.firstMetadataValue('dspace.entity.type');
    const type2: string = item2.firstMetadataValue('dspace.entity.type');
    return this.relationshipTypeService.getRelationshipTypeByLabelAndTypes(relationshipType, type1, type2)
      .pipe(
        mergeMap((type: RelationshipType) => {
          if (type === null) {
            return [null];
          } else {
            const isSwitched = type.rightwardType === relationshipType;
            if (isSwitched) {
              return this.relationshipService.addRelationship(type.id, item2, item1, nameVariant, undefined);
            } else {
              return this.relationshipService.addRelationship(type.id, item1, item2, undefined, nameVariant);
            }
          }
        }),
        take(1),
        tap((rd: RemoteData<Relationship>) => {
          if (hasNoValue(rd) || rd.hasFailed) {
            // An error occurred, deselect the object from the selectable list and display an error notification
            const listId = `list-${submissionId}-${relationshipType}`;
            this.selectableListService.findSelectedByCondition(listId, (object: any) => hasValue(object.indexableObject) && object.indexableObject.uuid === item2.uuid).pipe(
              take(1),
              hasValueOperator(),
            ).subscribe((selected) => {
              this.selectableListService.deselectSingle(listId, selected);
            });
            let errorContent;
            if (hasNoValue(rd)) {
              errorContent = this.translateService.instant('relationships.add.error.relationship-type.content', { type: relationshipType });
            } else {
              errorContent = this.translateService.instant('relationships.add.error.server.content');
            }
            this.notificationsService.error(this.translateService.instant('relationships.add.error.title'), errorContent);
          }
        }),
      );
  }

  private removeRelationship(item1: Item, item2: Item, relationshipType: string) {
    return this.relationshipService.getRelationshipByItemsAndLabel(item1, item2, relationshipType).pipe(
      mergeMap((relationship: Relationship) => this.relationshipService.deleteRelationship(relationship.id, 'none')),
      take(1),
    );
  }

  /**
   * Make sure the SubmissionObject is refreshed in the cache after being used
   * @param submissionId The ID of the submission object
   */
  private refreshWorkspaceItemInCache(submissionId: string): Observable<SubmissionObject> {
    return this.submissionObjectService.findById(submissionId, false, false, followLink('item')).pipe(getFirstSucceededRemoteData(), getRemoteDataPayload());
  }
}
