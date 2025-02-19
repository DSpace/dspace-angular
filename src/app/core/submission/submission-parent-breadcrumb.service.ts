import { Injectable } from '@angular/core';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils';
import {
  combineLatest,
  Observable,
  of as observableOf,
  switchMap,
} from 'rxjs';

import { SubmissionService } from '../../submission/submission.service';
import { Breadcrumb } from '../breadcrumbs/breadcrumb.model';
import { BreadcrumbsProviderService } from '../breadcrumbs/breadcrumbsProviderService';
import { DSOBreadcrumbsService } from '../breadcrumbs/dso-breadcrumbs.service';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { CollectionDataService } from '../data/collection-data.service';
import { RemoteData } from '../data/remote-data';
import { getDSpaceObjectRoute } from '../router/utils/routes-utils';
import { Collection } from '../shared/collection.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../shared/operators';
import { SubmissionObject } from './models/submission-object.model';

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
      return observableOf([]);
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
          return observableOf(collection);
        }
      }),
      switchMap((collection: Collection) => this.dsoBreadcrumbsService.getBreadcrumbs(collection, getDSpaceObjectRoute(collection))),
    );
  }

}
