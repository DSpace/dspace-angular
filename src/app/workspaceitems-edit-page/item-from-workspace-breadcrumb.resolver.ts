import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BreadcrumbConfig, SubmissionObject, WorkspaceitemDataService } from '@dspace/core'

import {
  SubmissionParentBreadcrumbResolver,
} from '../submission/resolvers/submission-parent-breadcrumb.resolver';
import {
  SubmissionParentBreadcrumbsService,
} from '../submission/resolvers/submission-parent-breadcrumb.service';

/**
 * This class represents a resolver that retrieves the breadcrumbs of the workspace item
 */
@Injectable({
  providedIn: 'root',
})
export class ItemFromWorkspaceBreadcrumbResolver extends SubmissionParentBreadcrumbResolver implements Resolve<BreadcrumbConfig<SubmissionObject>> {

  constructor(
    protected dataService: WorkspaceitemDataService,
    protected breadcrumbService: SubmissionParentBreadcrumbsService,
  ) {
    super(dataService, breadcrumbService);
  }

}
