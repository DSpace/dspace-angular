import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BreadcrumbConfig } from '../breadcrumbs/breadcrumb/breadcrumb-config.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../core/shared/operators';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { SUBMISSION_LINKS_TO_FOLLOW } from '../core/submission/resolver/submission-links-to-follow';
import { SubmissionParentBreadcrumbsService } from '../core/submission/submission-parent-breadcrumb.service';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';

export const itemFromWorkflowBreadcrumbResolver: ResolveFn<BreadcrumbConfig<SubmissionObject>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<BreadcrumbConfig<SubmissionObject>> => {
  const dataService = inject(WorkflowItemDataService);
  const breadcrumbService = inject(SubmissionParentBreadcrumbsService);

  return dataService.findById(
    route.params.id,
    true,
    false,
    ...SUBMISSION_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
    getRemoteDataPayload(),
    map((submissionObject: SubmissionObject) => ({
      provider: breadcrumbService,
      key: submissionObject,
    } as BreadcrumbConfig<SubmissionObject>)),
  );
};
