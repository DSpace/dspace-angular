import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import { find, map, take } from 'rxjs/operators';
import {
  EPeopleRegistryCancelEPersonAction,
  EPeopleRegistryEditEPersonAction
} from '../../access-control/epeople-registry/epeople-registry.actions';
import { EPeopleRegistryState } from '../../access-control/epeople-registry/epeople-registry.reducers';
import { AppState } from '../../app.reducer';
import { hasValue, hasNoValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DataService } from '../data/data.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList, buildPaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { FindListOptions, PatchRequest, PostRequest, } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getRemoteDataPayload, getFirstSucceededRemoteData, } from '../shared/operators';
import { EPerson } from './models/eperson.model';
import { EPERSON } from './models/eperson.resource-type';
import { NoContent } from '../shared/NoContent.model';
import { PageInfo } from '../shared/page-info.model';

const ePeopleRegistryStateSelector = (state: AppState) => state.epeopleRegistry;
const editEPersonSelector = createSelector(ePeopleRegistryStateSelector, (ePeopleRegistryState: EPeopleRegistryState) => ePeopleRegistryState.editEPerson);

/**
 * A service to retrieve {@link EPerson}s from the REST API & EPerson related CRUD actions
 */
@Injectable()
@dataService(EPERSON)
export class EPersonDataService extends DataService<EPerson> {

  protected linkPath = 'epersons';
  protected searchByEmailPath = 'byEmail';
  protected searchByMetadataPath = 'byMetadata';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<EPerson>
  ) {
    super();
  }

  /**
   * Search the EPeople with a given scope and query
   * @param scope   Scope of the EPeople search, default byMetadata
   * @param query   Query of search
   * @param options Options of search request
   */
  public searchByScope(scope: string, query: string, options: FindListOptions = {}, useCachedVersionIfAvailable?: boolean): Observable<RemoteData<PaginatedList<EPerson>>> {
    switch (scope) {
      case 'metadata':
        return this.getEpeopleByMetadata(query.trim(), options, useCachedVersionIfAvailable);
      case 'email':
        return this.getEPersonByEmail(query.trim()).pipe(
          map((rd: RemoteData<EPerson | NoContent>) => {
            if (rd.hasSucceeded) {
              // Turn the single EPerson or NoContent in to a PaginatedList<EPerson>
              let page;
              if (rd.statusCode === 204 || hasNoValue(rd.payload)) {
                page = [];
              } else {
                page = [rd.payload];
              }
              return new RemoteData<PaginatedList<EPerson>>(
                rd.timeCompleted,
                rd.msToLive,
                rd.lastUpdated,
                rd.state,
                rd.errorMessage,
                buildPaginatedList(new PageInfo({
                  elementsPerPage: options.elementsPerPage,
                  totalElements: page.length,
                  totalPages: page.length,
                  currentPage: 1
                }), page),
                rd.statusCode
              );
            } else {
              // If it hasn't succeeded, there can be no payload, so we can re-cast the existing
              // RemoteData object
              return rd as RemoteData<PaginatedList<EPerson>>;
            }
          })
        );
      default:
        return this.getEpeopleByMetadata(query.trim(), options, useCachedVersionIfAvailable);
    }
  }

  /**
   * Returns a single EPerson, by email query (/eperson/epersons/search/{@link searchByEmailPath}?email=<>). If it can be found
   * NoContent otherwise
   *
   * @param query                       email query
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  public getEPersonByEmail(query: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<EPerson>[]): Observable<RemoteData<EPerson | NoContent>> {
    const findListOptions = new FindListOptions();
    findListOptions.searchParams = [new RequestParam('email', encodeURIComponent(query))];
    const href$ = this.getSearchByHref(this.searchByEmailPath, findListOptions, ...linksToFollow);
    return this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns a search result list of EPeople, by metadata query (/eperson/epersons/search/{@link searchByMetadataPath}?query=<>)
   * @param query                       metadata query
   * @param options
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  private getEpeopleByMetadata(query: string, options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<EPerson>[]): Observable<RemoteData<PaginatedList<EPerson>>> {
    const searchParams = [new RequestParam('query', encodeURIComponent(query))];
    return this.getEPeopleBy(searchParams, this.searchByMetadataPath, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns a search result list of EPeople in a given searchMethod, with given searchParams
   * @param searchParams                query parameters in the search
   * @param searchMethod                searchBy path
   * @param options
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  private getEPeopleBy(searchParams: RequestParam[], searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<EPerson>[]): Observable<RemoteData<PaginatedList<EPerson>>> {
    let findListOptions = new FindListOptions();
    if (options) {
      findListOptions = Object.assign(new FindListOptions(), options);
    }
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }
    return this.searchBy(searchMethod, findListOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Add a new patch to the object cache
   * The patch is derived from the differences between the given object and its version in the object cache
   * @param {DSpaceObject} ePerson The given object
   */
  public updateEPerson(ePerson: EPerson): Observable<RemoteData<EPerson>> {
    const requestId = this.requestService.generateRequestId();
    const oldVersion$ = this.findByHref(ePerson._links.self.href, true, false);
    oldVersion$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      take(1)
    ).subscribe((oldEPerson: EPerson) => {
      const operations = this.generateOperations(oldEPerson, ePerson);
      const patchRequest = new PatchRequest(requestId, ePerson._links.self.href, operations);
      return this.requestService.send(patchRequest);
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Metadata operations are generated by the difference between old and new EPerson
   * Custom replace operations for the other EPerson values
   * @param oldEPerson
   * @param newEPerson
   */
  private generateOperations(oldEPerson: EPerson, newEPerson: EPerson): Operation[] {
    let operations = this.comparator.diff(oldEPerson, newEPerson).filter((operation: Operation) => operation.op === 'replace');
    if (hasValue(oldEPerson.email) && oldEPerson.email !== newEPerson.email) {
      operations = [...operations, {
        op: 'replace', path: '/email', value: newEPerson.email
      }];
    }
    if (hasValue(oldEPerson.requireCertificate) && oldEPerson.requireCertificate !== newEPerson.requireCertificate) {
      operations = [...operations, {
        op: 'replace', path: '/certificate', value: newEPerson.requireCertificate
      }];
    }
    if (hasValue(oldEPerson.canLogIn) && oldEPerson.canLogIn !== newEPerson.canLogIn) {
      operations = [...operations, {
        op: 'replace', path: '/canLogIn', value: newEPerson.canLogIn
      }];
    }
    return operations;
  }

  /**
   * Method that clears a cached EPerson request
   */
  public clearEPersonRequests(): void {
    this.getBrowseEndpoint().pipe(take(1)).subscribe((link: string) => {
      this.requestService.removeByHrefSubstring(link);
    });
  }

  /**
   * Method that clears a link's requests in cache
   */
  public clearLinkRequests(href: string): void {
    this.requestService.setStaleByHrefSubstring(href);
  }

  /**
   * Method to retrieve the eperson that is currently being edited
   */
  public getActiveEPerson(): Observable<EPerson> {
    return this.store.pipe(select(editEPersonSelector));
  }

  /**
   * Method to cancel editing an EPerson, dispatches a cancel EPerson action
   */
  public cancelEditEPerson() {
    this.store.dispatch(new EPeopleRegistryCancelEPersonAction());
  }

  /**
   * Method to set the EPerson being edited, dispatches an edit EPerson action
   * @param ePerson The EPerson to edit
   */
  public editEPerson(ePerson: EPerson) {
    this.store.dispatch(new EPeopleRegistryEditEPersonAction(ePerson));
  }

  /**
   * Method to delete an EPerson
   * @param ePerson The EPerson to delete
   */
  public deleteEPerson(ePerson: EPerson): Observable<RemoteData<NoContent>> {
    return this.delete(ePerson.id);
  }

  /**
   * Change which ePerson is being edited and return the link for EPeople edit page
   * @param ePerson New EPerson to edit
   */
  public startEditingNewEPerson(ePerson: EPerson): string {
    this.getActiveEPerson().pipe(take(1)).subscribe((activeEPerson: EPerson) => {
      if (ePerson === activeEPerson) {
        this.cancelEditEPerson();
      } else {
        this.editEPerson(ePerson);
      }
    });
    return '/access-control/epeople';
  }

  /**
   * Get EPeople admin page
   * @param ePerson New EPerson to edit
   */
  public getEPeoplePageRouterLink(): string {
    return '/access-control/epeople';
  }

  /**
   * Create a new EPerson using a token
   * @param eperson
   * @param token
   */
  public createEPersonForToken(eperson: EPerson, token: string): Observable<RemoteData<EPerson>> {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getBrowseEndpoint().pipe(
      map((href: string) => `${href}?token=${token}`));
    hrefObs.pipe(
      find((href: string) => hasValue(href)),
    ).subscribe((href: string) => {
      const request = new PostRequest(requestId, href, eperson);
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);

  }

  /**
   * Sends a patch request to update an epersons password based on a forgot password token
   * @param uuid      Uuid of the eperson
   * @param token     The forgot password token
   * @param password  The new password value
   */
  patchPasswordWithToken(uuid: string, token: string, password: string): Observable<RemoteData<EPerson>> {
    const requestId = this.requestService.generateRequestId();

    const operation = Object.assign({ op: 'add', path: '/password', value: password });

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, uuid)),
      map((href: string) => `${href}?token=${token}`));

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
    ).subscribe((href: string) => {
      const request = new PatchRequest(requestId, href, [operation]);
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

}
