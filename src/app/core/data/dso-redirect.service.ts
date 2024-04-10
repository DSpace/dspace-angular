/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
/* eslint-disable max-classes-per-file */
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { getDSORoute } from '../../app-routing-paths';
import { hasValue } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HardRedirectService } from '../services/hard-redirect.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { RemoteData } from './remote-data';
import { IdentifierType } from './request.models';
import { RequestService } from './request.service';

const ID_ENDPOINT = 'pid';
const UUID_ENDPOINT = 'dso';

/**
 * A data service to retrieve DSpaceObjects by persistent identifier or UUID.
 * Doesn't define a constant {@link linkPath} but switches between two endpoints on demand:
 * {@link setLinkPath} must be called before each request.
 */
class DsoByIdOrUUIDDataService extends IdentifiableDataService<DSpaceObject> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super(
      undefined, requestService, rdbService, objectCache, halService, undefined,
      // interpolate id/uuid as query parameter
      (endpoint: string, resourceID: string): string => {
        return endpoint.replace(/{\?id}/, `?id=${resourceID}`)
          .replace(/{\?uuid}/, `?uuid=${resourceID}`);
      },
    );
  }

  /**
   * The default 'pid' endpoint for identifiers does not support uuid lookups.
   * For uuid lookups we need to change the linkPath.
   * @param identifierType
   */
  setLinkPath(identifierType: IdentifierType) {
    if (identifierType === IdentifierType.UUID) {
      this.linkPath = UUID_ENDPOINT;
    } else {
      this.linkPath = ID_ENDPOINT;
    }
  }
}

/**
 * A service to handle redirects from identifier paths to DSO path
 * e.g.: redirect from /handle/... to /items/...
 */
@Injectable({ providedIn: 'root' })
export class DsoRedirectService {
  private dataService: DsoByIdOrUUIDDataService;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    private hardRedirectService: HardRedirectService,
  ) {
    this.dataService = new DsoByIdOrUUIDDataService(requestService, rdbService, objectCache, halService);
  }

  /**
   * Redirect to a DSpaceObject's path using the given identifier type and ID.
   * This is used to redirect paths like "/handle/[prefix]/[suffix]" to the object's path (e.g. /items/[uuid]).
   * See lookupGuard for more examples.
   *
   * @param id              the identifier of the object to retrieve
   * @param identifierType  the type of the given identifier (defaults to UUID)
   */
  findByIdAndIDType(id: string, identifierType = IdentifierType.UUID): Observable<RemoteData<DSpaceObject>> {
    this.dataService.setLinkPath(identifierType);
    return this.dataService.findById(id).pipe(
      getFirstCompletedRemoteData(),
      tap((response) => {
        if (response.hasSucceeded) {
          const dso = response.payload;
          if (hasValue(dso.uuid)) {
            const newRoute = getDSORoute(dso);
            if (hasValue(newRoute)) {
              // Use a "301 Moved Permanently" redirect for SEO purposes
              this.hardRedirectService.redirect(this.appConfig.ui.nameSpace.replace(/\/$/, '') + newRoute, 301);
            }
          }
        }
      }),
    );
  }
}
