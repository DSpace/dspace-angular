import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { ReplaceOperation } from 'fast-json-patch';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, flatMap, map, take, tap } from 'rxjs/operators';

import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstSucceededRemoteDataPayload, getFinishedRemoteData } from '../shared/operators';
import { ResearcherProfile } from './model/researcher-profile.model';
import { RESEARCHER_PROFILE } from './model/researcher-profile.resource-type';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class ResearcherProfileServiceImpl extends DataService<ResearcherProfile> {
    protected linkPath = 'profiles';

    constructor(
      protected requestService: RequestService,
      protected rdbService: RemoteDataBuildService,
      protected store: Store<CoreState>,
      protected objectCache: ObjectCacheService,
      protected halService: HALEndpointService,
      protected notificationsService: NotificationsService,
      protected http: HttpClient,
      protected comparator: DefaultChangeAnalyzer<ResearcherProfile>) {
      super();
    }

}

/**
 * A service that provides methods to make REST requests with researcher profile endpoint.
 */
@Injectable()
@dataService(RESEARCHER_PROFILE)
export class ResearcherProfileService {

    dataService: ResearcherProfileServiceImpl;

    responseMsToLive: number = 10 * 1000;

    constructor(
        protected requestService: RequestService,
        protected rdbService: RemoteDataBuildService,
        protected store: Store<CoreState>,
        protected objectCache: ObjectCacheService,
        protected halService: HALEndpointService,
        protected notificationsService: NotificationsService,
        protected http: HttpClient,
        protected comparator: DefaultChangeAnalyzer<ResearcherProfile>,
        protected itemService: ItemDataService ) {

            this.dataService = new ResearcherProfileServiceImpl(requestService, rdbService, store, objectCache, halService,
                notificationsService, http, comparator);

    }

    /**
     * Find the researcher profile with the given uuid.
     *
     * @param uuid the profile uuid
     */
    findById(uuid: string): Observable<ResearcherProfile> {
        return this.dataService.findById ( uuid )
            .pipe ( getFinishedRemoteData(),
                map((remoteData) => remoteData.payload),
                tap((profile) => this.requestService.removeByHrefSubstring('cris/profiles/' + uuid)));
    }

    /**
     * Create a new researcher profile for the current user.
     */
    create(): Observable<ResearcherProfile> {
        return this.dataService.create( new ResearcherProfile())
            .pipe ( getFinishedRemoteData(),
                map((remoteData) => remoteData.payload));
    }

    /**
     * Delete a researcher profile.
     *
     * @param researcherProfile the profile to delete
     */
    delete( researcherProfile: ResearcherProfile): Observable<boolean> {
        return this.dataService.delete(researcherProfile.id)
            .pipe( take(1),
             tap( (deleted) => {
                 if ( deleted) {
                     this.requestService.removeByHrefSubstring(researcherProfile._links.self.href);
                 }
             }));
    }

    /**
     * Find the item id related to the given researcher profile.
     *
     * @param researcherProfile the profile to find for
     */
    findRelatedItemId( researcherProfile: ResearcherProfile ): Observable<string> {
        return this.itemService.findByHref ( researcherProfile._links.item.href)
            .pipe (getFirstSucceededRemoteDataPayload(),
            catchError((error) => {
                console.debug(error);
                return observableOf(null);
            }),
            map((item) => item != null ? item.id : null ));
    }

    /**
     * Change the visibility of the given researcher profile setting the given value.
     *
     * @param researcherProfile the profile to update
     * @param visible the visibility value to set
     */
    setVisibility(researcherProfile: ResearcherProfile, visible: boolean): Observable<ResearcherProfile> {

        const replaceOperation: ReplaceOperation<boolean> = {
            path: '/visible',
            op: 'replace',
            value: visible
        };

        return this.dataService.patch(researcherProfile, [replaceOperation])
            .pipe (flatMap( (response ) => this.findById(researcherProfile.id)));
    }

}
