import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { SubmissionParentBreadcrumbResolver } from '../core/submission/resolver/submission-parent-breadcrumb.resolver';
import { BreadcrumbConfig } from '../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { SubmissionParentBreadcrumbsService } from '../core/submission/submission-parent-breadcrumb.service';
import { SubmissionObject } from '../core/submission/models/submission-object.model';

/**
 * This class represents a resolver that retrieves the breadcrumbs of the workflow item
 */
@Injectable()
export class ItemFromWorkflowBreadcrumbResolver extends SubmissionParentBreadcrumbResolver implements Resolve<BreadcrumbConfig<SubmissionObject>> {

  constructor(
    protected dataService: WorkflowItemDataService,
    protected breadcrumbService: SubmissionParentBreadcrumbsService,
  ) {
    super(dataService, breadcrumbService);
  }

}
