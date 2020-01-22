import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { ItemDataService } from './item-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { filter, find, map, switchMap } from 'rxjs/operators';
import { configureRequest, getSucceededRemoteData } from '../shared/operators';
import { Observable } from 'rxjs/internal/Observable';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { isNotUndefined } from '../../shared/empty.util';
import { FindListOptions, FindListRequest } from './request.models';

/**
 * The service handling all relationship type requests
 */
@Injectable()
@dataService(RelationshipType.type)
export class RelationshipTypeService extends DataService<RelationshipType> {
  protected linkPath = 'relationshiptypes';

  constructor(protected itemService: ItemDataService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected dataBuildService: NormalizedObjectBuildService,
              protected store: Store<CoreState>,
              protected halService: HALEndpointService,
              protected objectCache: ObjectCacheService,
              protected notificationsService: NotificationsService,
              protected http: HttpClient,
              protected comparator: DefaultChangeAnalyzer<RelationshipType>,
              protected appStore: Store<AppState>) {
    super()
  }

  /**
   * Get the endpoint for a relationship type by ID
   * @param id
   */
  getRelationshipTypeEndpoint(id: number) {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((href: string) => `${href}/${id}`)
    );
  }

  getAllRelationshipTypes(options: FindListOptions): Observable<RemoteData<PaginatedList<RelationshipType>>> {
    const link$ = this.halService.getEndpoint(this.linkPath);
    return link$
      .pipe(
        map((endpointURL: string) => new FindListRequest(this.requestService.generateRequestId(), endpointURL, options)),
        configureRequest(this.requestService),
        switchMap(() => this.rdbService.buildList(link$))
      ) as Observable<RemoteData<PaginatedList<RelationshipType>>>;
  }

  /**
   * Get the RelationshipType for a relationship type by label
   * @param label
   */
  getRelationshipTypeByLabelAndTypes(label: string, firstType: string, secondType: string): Observable<RelationshipType> {
    return this.getAllRelationshipTypes({ currentPage: 1, elementsPerPage: Number.MAX_VALUE })
      .pipe(
        getSucceededRemoteData(),
        /* Flatten the page so we can treat it like an observable */
        switchMap((typeListRD: RemoteData<PaginatedList<RelationshipType>>) => typeListRD.payload.page),
        switchMap((type: RelationshipType) => {
          if (type.leftwardType === label) {
            return this.checkType(type, firstType, secondType);
          } else if (type.rightwardType === label) {
            return this.checkType(type, secondType, firstType);
          } else {
            return [];
          }
        }),
      );
  }

  // Check if relationship type matches the given types
  // returns a void observable if there's not match
  // returns an observable that emits the relationship type when there is a match
  private checkType(type: RelationshipType, firstType: string, secondType: string): Observable<RelationshipType> {
    const entityTypes = observableCombineLatest(type.leftType.pipe(getSucceededRemoteData()), type.rightType.pipe(getSucceededRemoteData()));
    return entityTypes.pipe(
      find(([leftTypeRD, rightTypeRD]: [RemoteData<ItemType>, RemoteData<ItemType>]) => leftTypeRD.payload.label === firstType && rightTypeRD.payload.label === secondType),
      filter((types) => isNotUndefined(types)),
      map(() => type)
    );
  }
}
