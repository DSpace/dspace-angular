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
import { GetRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import {switchMap, take, tap} from 'rxjs/operators';
import { RemoteData } from './remote-data';
import {RelationshipType} from '../shared/item-relationships/relationship-type.model';
import {PaginatedList} from './paginated-list';
import {ItemType} from '../shared/item-relationships/item-type.model';

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

    // TODO: Remove mock data once REST API supports this
    /*
    href$.pipe(take(1)).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.configure(request);
    });

    return this.rdbService.buildSingle<EntityType>(href$);
    */

    // Mock:
    const index = [
      'Publication',
      'Person',
      'Project',
      'OrgUnit',
      'Journal',
      'JournalVolume',
      'JournalIssue',
      'DataPackage',
      'DataFile',
    ].indexOf(label);

    return this.findById((index + 1) + '');
  }
}
