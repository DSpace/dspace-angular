import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
import { getFirstSucceededRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
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
     * @param payload feedback to be sent
     * @return Observable<RemoteData<Feedback>
     *     server response
     */
    createFeedback(payload: Feedback): Observable<RemoteData<Feedback>> {
        return this.create(payload);
    }

}
