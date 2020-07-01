import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Operation } from 'fast-json-patch/lib/core';
import { Observable } from 'rxjs';
import { filter, find, map, take } from 'rxjs/operators';
import {
  EPeopleRegistryCancelEPersonAction,
  EPeopleRegistryEditEPersonAction
} from '../../+admin/admin-access-control/epeople-registry/epeople-registry.actions';
import { EPeopleRegistryState } from '../../+admin/admin-access-control/epeople-registry/epeople-registry.reducers';
import { AppState } from '../../app.reducer';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { DataService } from '../data/data.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { FindListOptions, FindListRequest, PatchRequest, PostRequest, } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../shared/operators';
import { EPerson } from './models/eperson.model';
import { EPERSON } from './models/eperson.resource-type';
import { RequestEntry } from '../data/request.reducer';

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
   * Retrieves all EPeople
   * @param options The options info used to retrieve the EPeople
   */
  public getEPeople(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<EPerson>>> {
    const hrefObs = this.getFindAllHref(options, this.linkPath);
    hrefObs.pipe(
      filter((href: string) => hasValue(href)),
      take(1))
      .subscribe((href: string) => {
        const request = new FindListRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<EPerson>(hrefObs) as Observable<RemoteData<PaginatedList<EPerson>>>;
  }

  /**
   * Search the EPeople with a given scope and query
   * @param scope   Scope of the EPeople search, default byMetadata
   * @param query   Query of search
   * @param options Options of search request
   */
  public searchByScope(scope: string, query: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<EPerson>>> {
    switch (scope) {
      case 'metadata':
        return this.getEpeopleByMetadata(query.trim(), options);
      case 'email':
        return this.getEpeopleByEmail(query.trim(), options);
      default:
        return this.getEpeopleByMetadata(query.trim(), options);
    }
  }

  /**
   * Returns a search result list of EPeople, by email query (/eperson/epersons/search/{@link searchByEmailPath}?email=<>)
   * @param query     email query
   * @param options
   * @param linksToFollow
   */
  private getEpeopleByEmail(query: string, options?: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<EPerson>>): Observable<RemoteData<PaginatedList<EPerson>>> {
    const searchParams = [new RequestParam('email', query)];
    return this.getEPeopleBy(searchParams, this.searchByEmailPath, options, ...linksToFollow);
  }

  /**
   * Returns a search result list of EPeople, by metadata query (/eperson/epersons/search/{@link searchByMetadataPath}?query=<>)
   * @param query     metadata query
   * @param options
   * @param linksToFollow
   */
  private getEpeopleByMetadata(query: string, options?: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<EPerson>>): Observable<RemoteData<PaginatedList<EPerson>>> {
    const searchParams = [new RequestParam('query', query)];
    return this.getEPeopleBy(searchParams, this.searchByMetadataPath, options, ...linksToFollow);
  }

  /**
   * Returns a search result list of EPeople in a given searchMethod, with given searchParams
   * @param searchParams    query parameters in the search
   * @param searchMethod    searchBy path
   * @param options
   * @param linksToFollow
   */
  private getEPeopleBy(searchParams: RequestParam[], searchMethod: string, options?: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<EPerson>>): Observable<RemoteData<PaginatedList<EPerson>>> {
    let findListOptions = new FindListOptions();
    if (options) {
      findListOptions = Object.assign(new FindListOptions(), options);
    }
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }
    return this.searchBy(searchMethod, findListOptions, ...linksToFollow);
  }

  /**
   * Add a new patch to the object cache
   * The patch is derived from the differences between the given object and its version in the object cache
   * @param {DSpaceObject} ePerson The given object
   */
  public updateEPerson(ePerson: EPerson): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();
    const oldVersion$ = this.findByHref(ePerson._links.self.href);
    oldVersion$.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((oldEPerson: EPerson) => {
        const operations = this.generateOperations(oldEPerson, ePerson);
        const patchRequest = new PatchRequest(requestId, ePerson._links.self.href, operations);
        return this.requestService.configure(patchRequest);
      }),
      take(1)
    ).subscribe();

    return this.fetchResponse(requestId);
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
    this.requestService.removeByHrefSubstring(href);
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
  public deleteEPerson(ePerson: EPerson): Observable<boolean> {
    return this.delete(ePerson.id).pipe(map((response: RestResponse) => response.isSuccessful));
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
    return '/admin/access-control/epeople';
  }

  /**
   * Get EPeople admin page
   * @param ePerson New EPerson to edit
   */
  public getEPeoplePageRouterLink(): string {
    return '/admin/access-control/epeople';
  }

  /**
   * Create a new EPerson using a token
   * @param eperson
   * @param token
   */
  public createEPersonForToken(eperson: EPerson, token: string) {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getBrowseEndpoint().pipe(
      map((href: string) => `${href}?token=${token}`));
    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, eperson);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.fetchResponse(requestId);

  }

  /**
   * Sends a patch request to update an epersons password based on a forgot password token
   * @param uuid      Uuid of the eperson
   * @param token     The forgot password token
   * @param password  The new password value
   */
  patchPasswordWithToken(uuid: string, token: string, password: string): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();

    const operation = Object.assign({ op: 'replace', path: '/password', value: password });

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, uuid)),
      map((href: string) => `${href}?token=${token}`));

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PatchRequest(requestId, href, [operation]);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response)
    );
  }

}
