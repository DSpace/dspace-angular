import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { RemoteData } from './remote-data';
import { IdentifierType } from './request.models';
import { RequestService } from './request.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { CoreState } from '../core-state.model';

@Injectable()
export class DsoRedirectDataService extends DataService<any> {

  // Set the default link path to the identifier lookup endpoint.
  protected linkPath = 'pid';
  private uuidEndpoint = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<any>,
    private router: Router) {
    super();
  }

  setLinkPath(identifierType: IdentifierType) {
    // The default 'pid' endpoint for identifiers does not support uuid lookups.
    // For uuid lookups we need to change the linkPath.
    if (identifierType === IdentifierType.UUID) {
      this.linkPath = this.uuidEndpoint;
    }
  }

  getIDHref(endpoint, resourceID, ...linksToFollow: FollowLinkConfig<any>[]): string {
    // Supporting both identifier (pid) and uuid (dso) endpoints
    return this.buildHrefFromFindOptions( endpoint.replace(/\{\?id\}/, `?id=${resourceID}`)
        .replace(/\{\?uuid\}/, `?uuid=${resourceID}`),
      {}, [], ...linksToFollow);
  }

  findByIdAndIDType(id: string, identifierType = IdentifierType.UUID): Observable<RemoteData<DSpaceObject>> {
    this.setLinkPath(identifierType);
    return this.findById(id).pipe(
      getFirstCompletedRemoteData(),
      tap((response) => {
        if (response.hasSucceeded) {
          const dso = response.payload;
          const uuid = dso.uuid;
          if (hasValue(uuid)) {
            let newRoute = this.getEndpointFromDSOType(response.payload.type);
            if (dso.type.startsWith('item')) {
              newRoute = getItemPageRoute(dso as Item);
            } else if (hasValue(newRoute)) {
              newRoute += '/' + uuid;
            }
            if (hasValue(newRoute)) {
              this.router.navigate([newRoute]);
            }
          }
        }
      })
    );
  }
  // Is there an existing method somewhere else that converts dso type to route?
  getEndpointFromDSOType(dsoType: string): string {
    // Are there other types to consider?
    if (dsoType.startsWith('item')) {
      return 'items';
    } else if (dsoType.startsWith('community')) {
      return 'communities';
    } else if (dsoType.startsWith('collection')) {
      return 'collections';
    } else {
      return '';
    }
  }
}
