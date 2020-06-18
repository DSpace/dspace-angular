import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { AuthorizationSearchParams } from './authorization-search-params';
import { SiteDataService } from '../site-data.service';
import { hasNoValue } from '../../../shared/empty.util';
import { of as observableOf } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

/**
 * Operator accepting {@link AuthorizationSearchParams} and adding the current {@link Site}'s selflink to the parameter's
 * objectUrl property, if this property is empty
 * @param siteService The {@link SiteDataService} used for retrieving the repository's {@link Site}
 */
export const addSiteObjectUrlIfEmpty = (siteService: SiteDataService) =>
  (source: Observable<AuthorizationSearchParams>): Observable<AuthorizationSearchParams> =>
    source.pipe(
      switchMap((params: AuthorizationSearchParams) => {
        if (hasNoValue(params.objectUrl)) {
          return siteService.find().pipe(
            map((site) => Object.assign({}, params, { objectUrl: site.self }))
          );
        } else {
          return observableOf(params);
        }
      })
    );

/**
 * Operator accepting {@link AuthorizationSearchParams} and adding the authenticated user's uuid to the parameter's
 * ePersonUuid property, if this property is empty and an {@link EPerson} is currently authenticated
 * @param authService The {@link AuthService} used for retrieving the currently authenticated {@link EPerson}
 */
export const addAuthenticatedUserUuidIfEmpty = (authService: AuthService) =>
  (source: Observable<AuthorizationSearchParams>): Observable<AuthorizationSearchParams> =>
    source.pipe(
      switchMap((params: AuthorizationSearchParams) => {
        if (hasNoValue(params.ePersonUuid)) {
          return authService.isAuthenticated().pipe(
            switchMap((authenticated) => {
              if (authenticated) {
                return authService.getAuthenticatedUserFromStore().pipe(
                  map((ePerson) => Object.assign({}, params, { ePersonUuid: ePerson.uuid }))
                );
              } else {
                return observableOf(params)
              }
            })
          );
        } else {
          return observableOf(params);
        }
      })
    );
