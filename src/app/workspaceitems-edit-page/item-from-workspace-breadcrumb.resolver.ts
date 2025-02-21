import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { BreadcrumbConfig } from '@dspace/core';
import { SubmissionObject } from '@dspace/core';
import { SubmissionParentBreadcrumbResolver } from '@dspace/core';
import { SubmissionParentBreadcrumbsService } from '@dspace/core';
import { WorkspaceitemDataService } from '@dspace/core';

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
