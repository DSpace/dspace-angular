import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { SubmissionService } from '../../submission/submission.service';
import { RemoteData } from '../data/remote-data';
import { RemoteDataError } from '../data/remote-data-error';
import { SubmissionObject } from './models/submission-object.model';
import { SubmissionScopeType } from './submission-scope-type';
import { WorkflowItemDataService } from './workflowitem-data.service';
import { WorkspaceitemDataService } from './workspaceitem-data.service';
import { DataService } from '../data/data.service';
import { map } from 'rxjs/operators';
import { HALEndpointService } from '../shared/hal-endpoint.service';

/**
 * A service to retrieve submission objects (WorkspaceItem/WorkflowItem)
 * without knowing their type
 */
@Injectable({
  providedIn: 'root'
})
export class SubmissionObjectDataService {
  constructor(
    private workspaceitemDataService: WorkspaceitemDataService,
    private workflowItemDataService: WorkflowItemDataService,
    private submissionService: SubmissionService,
    private halService: HALEndpointService
  ) {
  }

  /**
   * Create the HREF for a specific object based on its identifier
   * @param id The identifier for the object
   */
  getHrefByID(id): Observable<string> {
    const dataService: DataService<SubmissionObject> = this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem ? this.workspaceitemDataService : this.workflowItemDataService;

    return this.halService.getEndpoint(dataService.getLinkPath()).pipe(
      map((endpoint: string) => dataService.getIDHref(endpoint, encodeURIComponent(id))));
  }

  /**
   * Retrieve a submission object based on its ID.
   *
   * @param id The identifier of a submission object
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findById(id: string, ...linksToFollow: Array<FollowLinkConfig<SubmissionObject>>): Observable<RemoteData<SubmissionObject>> {
    switch (this.submissionService.getSubmissionScope()) {
      case SubmissionScopeType.WorkspaceItem:
        return this.workspaceitemDataService.findById(id,...linksToFollow);
      case SubmissionScopeType.WorkflowItem:
        return this.workflowItemDataService.findById(id,...linksToFollow);
      default:
        const error = new RemoteDataError(
          undefined,
          undefined,
          'The request couldn\'t be sent. Unable to determine the type of submission object'
        );
        return observableOf(new RemoteData(false, false, false, error, undefined));
    }
  }
}
