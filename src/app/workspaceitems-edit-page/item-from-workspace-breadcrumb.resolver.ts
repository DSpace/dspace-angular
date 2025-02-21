import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { BreadcrumbConfig } from '../../../modules/core/src/lib/core/breadcrumbs/breadcrumb-config.model';
import { SubmissionObject } from '../../../modules/core/src/lib/core/submission/models/submission-object.model';
import { SubmissionParentBreadcrumbResolver } from '../../../modules/core/src/lib/core/submission/resolver/submission-parent-breadcrumb.resolver';
import { SubmissionParentBreadcrumbsService } from '../../../modules/core/src/lib/core/submission/submission-parent-breadcrumb.service';
import { WorkspaceitemDataService } from '../../../modules/core/src/lib/core/submission/workspaceitem-data.service';

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
