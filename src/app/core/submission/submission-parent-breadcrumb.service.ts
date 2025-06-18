import { BreadcrumbsProviderService } from '../breadcrumbs/breadcrumbsProviderService';
import { Injectable } from '@angular/core';
import { Observable, switchMap, combineLatest, of as observableOf } from 'rxjs';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { Collection } from '../shared/collection.model';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { SubmissionObject } from './models/submission-object.model';
import { RemoteData } from '../data/remote-data';
import { DSOBreadcrumbsService } from '../breadcrumbs/dso-breadcrumbs.service';
import { getDSORoute } from '../../app-routing-paths';
import { SubmissionService } from '../../submission/submission.service';
import { CollectionDataService } from '../data/collection-data.service';
import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';

/**
 * Service to calculate the parent {@link DSpaceObject} breadcrumbs for a {@link SubmissionObject}
 */
@Injectable()
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
      switchMap((collection: Collection) => this.dsoBreadcrumbsService.getBreadcrumbs(collection, getDSORoute(collection))),
    );
  }

}
