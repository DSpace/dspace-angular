import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { BreadcrumbConfig } from '../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { SubmissionParentBreadcrumbResolver } from '../core/submission/resolver/submission-parent-breadcrumb.resolver';
import { SubmissionParentBreadcrumbsService } from '../core/submission/submission-parent-breadcrumb.service';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';

/**
 * This class represents a resolver that retrieves the breadcrumbs of the workflow item
 */
@Injectable({
  providedIn: 'root',
})
export class ItemFromWorkflowBreadcrumbResolver extends SubmissionParentBreadcrumbResolver implements Resolve<BreadcrumbConfig<SubmissionObject>> {

  constructor(
    protected dataService: WorkflowItemDataService,
    protected breadcrumbService: SubmissionParentBreadcrumbsService,
  ) {
    super(dataService, breadcrumbService);
  }

}
