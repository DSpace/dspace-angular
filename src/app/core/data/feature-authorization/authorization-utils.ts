import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { Authorization } from '../../shared/authorization.model';
import { Feature } from '../../shared/feature.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../shared/operators';
import { PaginatedList } from '../paginated-list.model';
import { RemoteData } from '../remote-data';
import { SiteDataService } from '../site-data.service';
import { AuthorizationSearchParams } from './authorization-search-params';
import { FeatureID } from './feature-id';

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
            map((site) => Object.assign({}, params, { objectUrl: site.self })),
          );
        } else {
          return of(params);
        }
      }),
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
                  map((ePerson) => Object.assign({}, params, { ePersonUuid: ePerson.uuid })),
                );
              } else {
                return of(params);
              }
            }),
          );
        } else {
          return of(params);
        }
      }),
    );

/**
 * Operator checking if at least one of the provided {@link Authorization}s contains a {@link Feature} that matches the
 * provided {@link FeatureID}
 * Note: This expects the {@link Authorization}s to contain a resolved link to their {@link Feature}. If they don't,
 * this observable will always emit false.
 * @param featureID
 * @returns true if at least one {@link Feature} matches, false if none do
 */
export const oneAuthorizationMatchesFeature = (featureID: FeatureID) =>
  (source: Observable<Authorization[]>): Observable<boolean> =>
    source.pipe(
      switchMap((authorizations: Authorization[]) => {
        if (isNotEmpty(authorizations)) {
          return observableCombineLatest([
            ...authorizations
              .filter((authorization: Authorization) => hasValue(authorization.feature))
              .map((authorization: Authorization) => authorization.feature.pipe(
                getFirstSucceededRemoteDataPayload(),
              )),
          ]);
        } else {
          return of([]);
        }
      }),
      map((features: Feature[]) => features.filter((feature: Feature) => feature.id === featureID.valueOf()).length > 0),
    );

/**
 * Operator emitting the payload of the first completed page of {@link Authorization}s.
 * Errors instead if the request failed, so that callers can fall back to another check.
 */
export const getSucceededPageOrThrow = (source: Observable<RemoteData<PaginatedList<Authorization>>>): Observable<PaginatedList<Authorization>> =>
  source.pipe(
    getFirstCompletedRemoteData(),
    map((response: RemoteData<PaginatedList<Authorization>>) => {
      if (!response.hasSucceeded || !Array.isArray(response.payload?.page)) {
        throw new Error('Unable to retrieve object authorizations');
      }
      return response.payload;
    }),
  );

/**
 * Operator resolving the {@link Feature} of each {@link Authorization} and emitting the set of their IDs.
 * Errors if any feature cannot be retrieved, rather than waiting for one that never succeeds.
 */
export const authorizationFeatureIds = (source: Observable<Authorization[]>): Observable<Set<string>> =>
  source.pipe(
    switchMap((authorizations: Authorization[]) => {
      const features$ = (authorizations || [])
        .filter((authorization: Authorization) => hasValue(authorization.feature))
        .map((authorization: Authorization) => authorization.feature.pipe(
          getFirstCompletedRemoteData(),
          map((featureRD: RemoteData<Feature>) => {
            if (!featureRD.hasSucceeded || hasNoValue(featureRD.payload)) {
              throw new Error('Unable to retrieve authorization feature');
            }
            return featureRD.payload;
          }),
        ));
      return features$.length ? observableCombineLatest(features$) : of([]);
    }),
    map((features: Feature[]) => new Set(features.map((feature: Feature) => feature.id))),
  );
