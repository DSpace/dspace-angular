import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { AppState } from '../../app.reducer';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RELATIONSHIP_TYPE } from '../shared/item-relationships/relationship-type.resource-type';
import { getFirstSucceededRemoteData, getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { ItemDataService } from './item-data.service';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { CoreState } from '../core-state.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

/**
 * Check if one side of a RelationshipType is the ItemType with the given label
 *
 * @param typeRd the RemoteData for an ItemType
 * @param label  the label to check. e.g. Author
 */
const checkSide = (typeRd: RemoteData<ItemType>, label: string): boolean =>
  typeRd.hasSucceeded && typeRd.payload.label === label;

/**
 * The service handling all relationship type requests
 */
@Injectable()
@dataService(RELATIONSHIP_TYPE)
export class RelationshipTypeService extends DataService<RelationshipType> {
  protected linkPath = 'relationshiptypes';

  constructor(protected itemService: ItemDataService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected store: Store<CoreState>,
              protected halService: HALEndpointService,
              protected objectCache: ObjectCacheService,
              protected notificationsService: NotificationsService,
              protected http: HttpClient,
              protected comparator: DefaultChangeAnalyzer<RelationshipType>,
              protected appStore: Store<AppState>) {
    super();
  }

  /**
   * Find a RelationshipType object by its label, and the types of the items on either side.
   *
   * TODO this should be implemented as a rest endpoint, we shouldn't have logic on the client that
   * requires using a huge page-size in order to process "everything".
   *
   * @param relationshipTypeLabel The name of the relationType we're looking for
   *                              e.g. isAuthorOfPublication
   * @param firstItemType         The type of one of the sides of the relationship e.g. Publication
   * @param secondItemType        The type of the other side of the relationship e.g. Author
   */
  getRelationshipTypeByLabelAndTypes(relationshipTypeLabel: string, firstItemType: string, secondItemType: string): Observable<RelationshipType> {
    // Retrieve all relationship types from the server in a single page
    return this.findAll({ currentPage: 1, elementsPerPage: 9999 }, true, true, followLink('leftType'), followLink('rightType'))
      .pipe(
        getFirstSucceededRemoteData(),
        // Emit each type in the page array separately
        switchMap((typeListRD: RemoteData<PaginatedList<RelationshipType>>) => typeListRD.payload.page),
        // Check each type individually, to see if it matches the provided types
        mergeMap((relationshipType: RelationshipType) => {
          if (relationshipType.leftwardType === relationshipTypeLabel) {
            return this.checkType(relationshipType, firstItemType, secondItemType);
          } else if (relationshipType.rightwardType === relationshipTypeLabel) {
            return this.checkType(relationshipType, secondItemType, firstItemType);
          } else {
            return [null];
          }
        }),
        // Wait for all types to be checked and emit once, with the results combined back into an
        // array
        toArray(),
        // Look for a match in the array and emit it if found, or null if one isn't found
        map((types: RelationshipType[]) => {
          const match = types.find((type: RelationshipType) => hasValue(type));
          if (hasValue(match)) {
            return match;
          } else {
            return null;
          }
        })
      );
  }

  /**
   * Check if the given RelationshipType has the given itemTypes on its left and right sides.
   * Returns an observable of the given RelationshipType if it matches, null if it doesn't
   *
   * @param type            The RelationshipType to check
   * @param leftItemType    The item type that should be on the left side
   * @param rightItemType   The item type that should be on the right side
   * @private
   */
  private checkType(type: RelationshipType, leftItemType: string, rightItemType: string): Observable<RelationshipType> {
    return observableCombineLatest([
      type.leftType.pipe(getFirstCompletedRemoteData()),
      type.rightType.pipe(getFirstCompletedRemoteData())
    ]).pipe(
      map(([leftTypeRD, rightTypeRD]: [RemoteData<ItemType>, RemoteData<ItemType>]) => {
        if (checkSide(leftTypeRD, leftItemType) && checkSide(rightTypeRD, rightItemType)
        ) {
          return type;
        } else {
          return null;
        }
      })
    );
  }

  /**
   * Search of the given RelationshipType if has the given itemTypes on its left and right sides.
   * Returns an observable of the given RelationshipType if it matches, null if it doesn't
   *
   * @param type            The RelationshipType to check
   */
  searchByEntityType(type: string,useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<RelationshipType>[]): Observable<PaginatedList<RelationshipType>> {

    return this.searchBy(
      'byEntityType',
      {
        searchParams: [
          {
            fieldName: 'type',
            fieldValue: type
          },
          {
            fieldName: 'size',
            fieldValue: 100
          },
        ]
      }, useCachedVersionIfAvailable,reRequestOnStale,...linksToFollow).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ) as Observable<PaginatedList<RelationshipType>>;
  }


}
