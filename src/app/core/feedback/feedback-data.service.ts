import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map, filter, distinctUntilChanged, tap, mergeMap } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { DataService } from '../data/data.service';
import { Feedback } from './models/feedback.model';
import { FEEDBACK } from './models/feedback.resource-type';
import { dataService } from 'src/app/core/cache/builders/build-decorators';
import { RequestService } from 'src/app/core/data/request.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from 'src/app/core/cache/object-cache.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from 'src/app/core/data/dso-change-analyzer.service';
import { getFirstSucceededRemoteData, getRemoteDataPayload, getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { PostRequest } from 'src/app/core/data/request.models';
import { RemoteData } from 'src/app/core/data/remote-data';

/**
 * Service for checking and managing the feedback
 */
@Injectable()
@dataService(FEEDBACK)
export class FeedbackDataService extends DataService<Feedback> {
    protected linkPath = 'feedbacks';

    constructor(
        protected requestService: RequestService,
        protected rdbService: RemoteDataBuildService,
        protected store: Store<any>,
        protected objectCache: ObjectCacheService,
        protected halService: HALEndpointService,
        protected notificationsService: NotificationsService,
        protected http: HttpClient,
        protected comparator: DSOChangeAnalyzer<Feedback>,
    ) {
        super();
    }

    /**
     * Get feedback from its id
     * @param uuid string the id of the feedback
     */
    getFeedback(uuid: string): Observable<Feedback> {
        return this.findById(uuid).pipe(
            getFirstSucceededRemoteData(),
            getRemoteDataPayload(),
        );
    }


    /**
     * Create feedback
     * @param uuid string the id of the feedback
     * @return Observable<Feedback>
     *     server response
     */
    createFeedback(payoload: Feedback): Observable<RemoteData<Feedback>> {
        return this.postToEndpoint(this.linkPath, payoload);
    }

    /**
     * Make a new post request
     *
     * @param linkName
     *    The endpoint link name
     * @param body
     *    The post request body
     * @param options
     *    The [HttpOptions] object
     * @return Observable<Feedback>
     *     server response
     */
    public postToEndpoint(linkName: string, body: any, options?: HttpOptions): Observable<RemoteData<Feedback>> {
        const requestId = this.requestService.generateRequestId();
        const href$ = this.halService.getEndpoint(linkName).pipe(
            filter((href: string) => isNotEmpty(href)),
            distinctUntilChanged(),
            map((endpointURL: string) => {
                const request = new PostRequest(requestId, endpointURL, body, options);
                return this.requestService.send(request);
            }),
        ).subscribe();

        return this.rdbService.buildFromRequestUUID<Feedback>(requestId).pipe(
            getFirstCompletedRemoteData(),
            // getRemoteDataPayload(),
        );
    }

}
