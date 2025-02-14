import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BreadcrumbConfig } from '../../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { IdentifiableDataService } from '../../data/base/identifiable-data.service';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../shared/operators';
import { SubmissionObject } from '../models/submission-object.model';
import { SubmissionParentBreadcrumbsService } from '../submission-parent-breadcrumb.service';
import { SUBMISSION_LINKS_TO_FOLLOW } from './submission-links-to-follow';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
export abstract class SubmissionParentBreadcrumbResolver implements Resolve<BreadcrumbConfig<SubmissionObject>> {

  protected constructor(
    protected dataService: IdentifiableDataService<any>,
    protected breadcrumbService: SubmissionParentBreadcrumbsService,
  ) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<SubmissionObject>> {
    return this.dataService.findById(route.params.id,
      true,
      false,
      ...SUBMISSION_LINKS_TO_FOLLOW,
    ).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((submissionObject: SubmissionObject) => ({
        provider: this.breadcrumbService,
        key: submissionObject,
      } as BreadcrumbConfig<SubmissionObject>)),
    );
  }
}
