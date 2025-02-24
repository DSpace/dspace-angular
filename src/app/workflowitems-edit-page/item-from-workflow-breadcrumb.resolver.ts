import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  BreadcrumbConfig,
  SubmissionObject,
  SubmissionParentBreadcrumbResolver,
  SubmissionParentBreadcrumbsService,
  WorkflowItemDataService,
} from '@dspace/core';

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
