import { Injectable } from '@angular/core';
import {
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { getDSORoute } from '../../app-routing-paths';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';
import { SubmissionService } from '../../submission/submission.service';
import { BreadcrumbsProviderService } from '../breadcrumbs/breadcrumbsProviderService';
import { DSOBreadcrumbsService } from '../breadcrumbs/dso-breadcrumbs.service';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { CollectionDataService } from '../data/collection-data.service';
import { RemoteData } from '../data/remote-data';
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
