import { Injectable } from '@angular/core';
import {
  SortDirection,
  SortOptions,
  FindListOptions,
  PaginatedList,
  RemoteData,
  QualityAssuranceSourceObject,
  QualityAssuranceSourceDataService,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The service handling all Quality Assurance source requests to the REST service.
 */
@Injectable({ providedIn: 'root' })
export class QualityAssuranceSourceService {

  /**
   * Initialize the service variables.
   * @param {QualityAssuranceSourceDataService} qualityAssuranceSourceRestService
   */
  constructor(
    private qualityAssuranceSourceRestService: QualityAssuranceSourceDataService,
  ) {
  }

  /**
   * Return the list of Quality Assurance source managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the source per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<QualityAssuranceSourceObject>>
   *    The list of Quality Assurance source.
   */
  public getSources(elementsPerPage, currentPage): Observable<PaginatedList<QualityAssuranceSourceObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions,
    };

    return this.qualityAssuranceSourceRestService.getSources(findListOptions).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<QualityAssuranceSourceObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Quality Assurance source from the Broker source REST service');
        }
      }),
    );
  }
}
