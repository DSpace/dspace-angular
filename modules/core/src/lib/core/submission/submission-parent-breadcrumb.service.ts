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

import {
  Breadcrumb,
  BreadcrumbsProviderService,
  DSOBreadcrumbsService,
  DSONameService,
} from '../breadcrumbs';
import {
  CollectionDataService,
  RemoteData,
} from '../data';
import { getDSpaceObjectRoute } from '../router';
import {
  Collection,
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../shared';
import { SubmissionObject } from './models';
import { SubmissionService } from './submission.service';

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
