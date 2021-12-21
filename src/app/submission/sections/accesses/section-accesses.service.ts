import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { SubmissionState } from '../../submission.reducers';
import { isUndefined } from 'util';
import { submissionSectionFromIdSelector, submissionSectionDataFromIdSelector } from 'src/app/submission/selectors';


/**
 * A service that provides methods to handle submission's bitstream state.
 */
@Injectable()
export class SectionAccessesService {

  /**
   * Initialize service variables
   *
   * @param {Store<SubmissionState>} store
   */
  constructor(private store: Store<SubmissionState>) { }


  /**
   * Return bitstream's metadata
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   * @returns {Observable}
   *    Emits bitstream's metadata
   */
  public getAccessesData(submissionId: string, sectionId: string): Observable<any> {

    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(
      filter((state) => !isUndefined(state)),
      distinctUntilChanged());
  }
}
