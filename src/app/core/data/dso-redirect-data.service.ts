import { DataService } from './data.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from './request.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { FindListOptions, FindByIDRequest, IdentifierType } from './request.models';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { Injectable } from '@angular/core';
import { filter, take, tap } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { getFinishedRemoteData } from '../shared/operators';
import { Router } from '@angular/router';

@Injectable()
export class DsoRedirectDataService extends DataService<any> {

  // Set the default link path to the identifier lookup endpoint.
  protected linkPath = 'pid';
  protected forceBypassCache = false;
  private uuidEndpoint = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<any>,
    private router: Router) {
    super();
  }

  getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  setLinkPath(identifierType: IdentifierType) {
    // The default 'pid' endpoint for identifiers does not support uuid lookups.
    // For uuid lookups we need to change the linkPath.
    if (identifierType === IdentifierType.UUID) {
      this.linkPath = this.uuidEndpoint;
    }
  }

  getIDHref(endpoint, resourceID): string {
    // Supporting both identifier (pid) and uuid (dso) endpoints
    return endpoint.replace(/\{\?id\}/, `?id=${resourceID}`)
      .replace(/\{\?uuid\}/, `?uuid=${resourceID}`);
  }

  findById(id: string, identifierType = IdentifierType.UUID): Observable<RemoteData<FindByIDRequest>> {
    this.setLinkPath(identifierType);
    return super.findById(id).pipe(
      getFinishedRemoteData(),
      take(1),
      tap((response) => {
        if (response.hasSucceeded) {
          const uuid = response.payload.uuid;
          const newRoute = this.getEndpointFromDSOType(response.payload.type);
          if (hasValue(uuid) && hasValue(newRoute)) {
            this.router.navigate([newRoute + '/' + uuid]);
          }
        }
      })
    );
  }
  // Is there an existing method somewhere else that converts dso type to route?
  getEndpointFromDSOType(dsoType: string): string {
    // Are there other types to consider?
    if (dsoType.startsWith('item')) {
      return 'items'
    } else if (dsoType.startsWith('community')) {
      return 'communities';
    } else if (dsoType.startsWith('collection')) {
      return 'collections'
    } else {
      return '';
    }
  }
}
