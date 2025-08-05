import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BreadcrumbConfig } from '@dspace/core/breadcrumbs/models/breadcrumb-config.model';
import { SubmissionObject } from '@dspace/core/submission/models/submission-object.model';
import { SubmissionParentBreadcrumbResolver } from '@dspace/core/submission/resolver/submission-parent-breadcrumb.resolver';
import { SubmissionParentBreadcrumbsService } from '@dspace/core/submission/submission-parent-breadcrumb.service';
import { WorkspaceitemDataService } from '@dspace/core/submission/workspaceitem-data.service';

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
