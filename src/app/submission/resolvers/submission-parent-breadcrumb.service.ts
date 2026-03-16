import { Injectable } from '@angular/core';
import { BreadcrumbsProviderService } from '@dspace/core/breadcrumbs/breadcrumbsProviderService';
import { DSOBreadcrumbsService } from '@dspace/core/breadcrumbs/dso-breadcrumbs.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Breadcrumb } from '@dspace/core/breadcrumbs/models/breadcrumb.model';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getDSORoute } from '@dspace/core/router/utils/dso-route.utils';
import { Collection } from '@dspace/core/shared/collection.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { SubmissionObject } from '@dspace/core/submission/models/submission-object.model';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { SubmissionService } from '../submission.service';

/**
 * Service to calculate the parent {@link DSpaceObject} breadcrumbs for a {@link SubmissionObject}
 */
@Injectable({
  providedIn: 'root',
})
export class SubmissionParentBreadcrumbsService implements BreadcrumbsProviderService<SubmissionObject> {

  constructor(
    protected dsoNameService: DSONameService,
    protected dsoBreadcrumbsService: DSOBreadcrumbsService,
    protected submissionService: SubmissionService,
    protected collectionService: CollectionDataService,
  ) {
  }

  /**
   * Creates the parent breadcrumb structure for {@link SubmissionObject}s. It also automatically recreates the
   * parent breadcrumb structure when you change a {@link SubmissionObject}'s by dispatching a
   * {@link ChangeSubmissionCollectionAction}.
   *
   * @param submissionObject The {@link SubmissionObject} for which the parent breadcrumb structure needs to be created
   */
  getBreadcrumbs(submissionObject: SubmissionObject): Observable<Breadcrumb[]> {
    if (isEmpty(submissionObject)) {
      return of([]);
    }

    return combineLatest([
      (submissionObject.collection as Observable<RemoteData<Collection>>).pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
      ),
      this.submissionService.getSubmissionCollectionId(submissionObject.id),
    ]).pipe(
      switchMap(([collection, latestCollectionId]: [Collection, string]) => {
        if (hasValue(latestCollectionId)) {
          return this.collectionService.findById(latestCollectionId).pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload(),
          );
        } else {
          return of(collection);
        }
      }),
      switchMap((collection: Collection) => this.dsoBreadcrumbsService.getBreadcrumbs(collection, getDSORoute(collection))),
    );
  }

}
