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
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { ResearcherProfile } from './model/researcher-profile.model';
import { RESEARCHER_PROFILE } from './model/researcher-profile.resource-type';


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
export class ResearcherProfileService{
    
    private dataService: ResearcherProfileServiceImpl;
    
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

    findById(id: string) : Observable<ResearcherProfile> {
        return this.dataService.findById ( id )
            .pipe ( tap( x => console.log("FIND BY ID:",x)),getFirstSucceededRemoteDataPayload(),
            catchError((error) => {
                console.log("ERROR", error);
                return observableOf(null);
            }))     
    }

    create () : Observable<ResearcherProfile> {
        return this.dataService.create( new ResearcherProfile())
            .pipe ( tap( profile => console.log("CREATE:",profile)),
                getFirstSucceededRemoteDataPayload() );
    }

    deleteById ( researcherProfile: ResearcherProfile) : Observable<boolean>{
        return this.dataService.delete(researcherProfile.id)
            .pipe( take(1),
             tap( deleted => {
                 if ( deleted){
                     this.objectCache.remove(researcherProfile._links.self.href);
                 }
             }));
    }

    findRelatedItemId ( researcherProfile: ResearcherProfile ) : Observable<string>{
        return this.itemService.findByHref ( researcherProfile._links.item.href)
            .pipe (getFirstSucceededRemoteDataPayload(),
            catchError((error) => {
                console.debug(error);
                return observableOf(null);
            }),
            map(item => item != null ? item.id : null ));
    }

    setVisibility(researcherProfile : ResearcherProfile, visible : boolean) : Observable<ResearcherProfile>{
        
        const replaceOperation : ReplaceOperation<Boolean> = { 
            path: '/visible',
            op: 'replace',
            value: visible
        };

        return this.dataService.patch(researcherProfile, [replaceOperation])
            .pipe (flatMap( (response ) => this.findById(researcherProfile.id)));
    }


}