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
import { FindListOptions, GetRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { RemoteData } from './remote-data';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { getFirstSucceededRemoteData, getRemoteDataPayload } from '../shared/operators';
import { PaginatedList } from './paginated-list.model';

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
   * Get the endpoint for the item type's allowed relationship types
   *
   * @param {FindListOptions} options
   */
  getAllAuthorizedRelationshipType(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<ItemType>>> {
    const searchHref = 'findAllByAuthorizedCollection';

    return this.searchBy(searchHref, options).pipe(
      filter((type: RemoteData<PaginatedList<ItemType>>) => !type.isResponsePending));
  }

  /**
   * Used to verify if there are one or more entities available
   */
  hasMoreThanOneAuthorized(): Observable<boolean> {
    const findListOptions: FindListOptions = {
      elementsPerPage: 2,
      currentPage: 1
    };
    return this.getAllAuthorizedRelationshipType(findListOptions).pipe(
      map((result: RemoteData<PaginatedList<ItemType>>) => {
        let output: boolean;
        if (result.payload) {
          output = ( result.payload.page.length > 1 );
        } else {
          output = false;
        }
        return output;
      })
    );
  }

  /**
   * Get the endpoint for the item type's allowed relationship types. To use with external source import.
   * @param entityTypeId
   */
  getAllAuthorizedRelationshipTypeImport(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<ItemType>>> {
    const searchHref = 'findAllByAuthorizedExternalSource';

    return this.searchBy(searchHref, options).pipe(
      filter((type: RemoteData<PaginatedList<ItemType>>) => !type.isResponsePending));
  }

  /**
   * Used to verify if there are one or more entities available. To use with external source import.
   */
  hasMoreThanOneAuthorizedImport(): Observable<boolean> {
    const findListOptions: FindListOptions = {
      elementsPerPage: 2,
      currentPage: 1
    };
    return this.getAllAuthorizedRelationshipTypeImport(findListOptions).pipe(
      map((result: RemoteData<PaginatedList<ItemType>>) => {
        let output: boolean;
        if (result.payload) {
          output = ( result.payload.page.length > 1 );
        } else {
          output = false;
        }
        return output;
      })
    );
  }

  /**
   * Get the allowed relationship types for an entity type
   * @param entityTypeId
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  getEntityTypeRelationships(entityTypeId: string, ...linksToFollow: Array<FollowLinkConfig<RelationshipType>>): Observable<RemoteData<PaginatedList<RelationshipType>>> {

    const href$ = this.getRelationshipTypesEndpoint(entityTypeId);

    href$.pipe(take(1)).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.configure(request);
    });

    return this.rdbService.buildList(href$, ...linksToFollow);
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
