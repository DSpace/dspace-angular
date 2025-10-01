import {
  inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { IdentifiableDataService } from '@dspace/core/data/base/identifiable-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestEntryState } from '@dspace/core/data/request-entry-state.model';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { SubmissionObject } from '@dspace/core/submission/models/submission-object.model';
import { SubmissionScopeType } from '@dspace/core/submission/submission-scope-type';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { WorkspaceitemDataService } from '@dspace/core/submission/workspaceitem-data.service';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { SubmissionService } from './submission.service';

/**
 * A service to retrieve submission objects (WorkspaceItem/WorkflowItem)
 * without knowing their type
 */
@Injectable({
  providedIn: 'root',
})
export class SubmissionObjectService {
  private readonly appConfig: AppConfig = inject(APP_CONFIG);

  constructor(
    private workspaceitemDataService: WorkspaceitemDataService,
    private workflowItemDataService: WorkflowItemDataService,
    private submissionService: SubmissionService,
    private halService: HALEndpointService,
  ) {
  }

  /**
   * Create the HREF for a specific object based on its identifier
   * @param id The identifier for the object
   */
  getHrefByID(id): Observable<string> {
    const dataService: IdentifiableDataService<SubmissionObject> = this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem ? this.workspaceitemDataService : this.workflowItemDataService;

    return this.halService.getEndpoint(dataService.getLinkPath()).pipe(
      map((endpoint: string) => dataService.getIDHref(endpoint, encodeURIComponent(id))));
  }

  /**
   * Retrieve a submission object based on its ID.
   *
   * @param id                          The identifier of a submission object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
  findById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<SubmissionObject>[]): Observable<RemoteData<SubmissionObject>> {
    switch (this.submissionService.getSubmissionScope()) {
      case SubmissionScopeType.WorkspaceItem:
        return this.workspaceitemDataService.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
      case SubmissionScopeType.WorkflowItem:
        return this.workflowItemDataService.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
      default: {
        const now = new Date().getTime();
        return of(new RemoteData(
          now,
          this.appConfig.cache.msToLive.default,
          now,
          RequestEntryState.Error,
          'The request could not be sent. Unable to determine the type of submission object',
          undefined,
          400,
        ));
      }
    }
  }
}
