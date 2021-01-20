import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { RemoteData } from './remote-data';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { PaginatedList } from './paginated-list.model';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { getRemoteDataPayload, getFirstSucceededRemoteData } from '../shared/operators';
import { RelationshipTypeService } from './relationship-type.service';

/**
 * Service handling all ItemType requests
 */
@Injectable()
export class EntityTypeService extends DataService<ItemType> {

  protected linkPath = 'entitytypes';

  constructor(protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected store: Store<CoreState>,
              protected halService: HALEndpointService,
              protected objectCache: ObjectCacheService,
              protected notificationsService: NotificationsService,
              protected relationshipTypeService: RelationshipTypeService,
              protected http: HttpClient,
              protected comparator: DefaultChangeAnalyzer<ItemType>) {
    super();
  }

  getBrowseEndpoint(options, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the endpoint for the item type's allowed relationship types
   * @param entityTypeId
   */
  getRelationshipTypesEndpoint(entityTypeId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((href) => this.halService.getEndpoint('relationshiptypes', `${href}/${entityTypeId}`))
    );
  }

  /**
   * Check whether a given entity type is the left type of a given relationship type, as an observable boolean
   * @param relationshipType  the relationship type for which to check whether the given entity type is the left type
   * @param entityType  the entity type for which to check whether it is the left type of the given relationship type
   */
  isLeftType(relationshipType: RelationshipType, itemType: ItemType): Observable<boolean> {

    return relationshipType.leftType.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((leftType) => leftType.uuid === itemType.uuid),
    );
  }

  /**
   * Get the allowed relationship types for an entity type
   * @param entityTypeId
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  getEntityTypeRelationships(entityTypeId: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<RelationshipType>[]): Observable<RemoteData<PaginatedList<RelationshipType>>> {
    const href$ = this.getRelationshipTypesEndpoint(entityTypeId);
    return this.relationshipTypeService.findAllByHref(href$, undefined, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Get an entity type by their label
   * @param label
   */
  getEntityTypeByLabel(label: string): Observable<RemoteData<ItemType>> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      take(1),
      switchMap((endPoint: string) =>
        this.findByHref(endPoint + '/label/' + label))
    );
  }
}
