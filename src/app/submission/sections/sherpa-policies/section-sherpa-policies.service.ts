import { WorkspaceitemSectionSherpaPoliciesObject } from './../../../core/submission/models/workspaceitem-section-sherpa-policies.model';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { SubmissionState } from '../../submission.reducers';
import { isNotUndefined } from '../../../shared/empty.util';
import { submissionSectionDataFromIdSelector } from '../../selectors';

/**
 * A service that provides methods to handle submission item's accesses condition state.
 */
@Injectable()
export class SectionSherpaPoliciesService {

  /**
   * Initialize service variables
   *
   * @param {Store<SubmissionState>} store
   */
  constructor(private store: Store<SubmissionState>) { }


  /**
   * Return item's accesses condition state.
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @returns {Observable}
   *    Emits bitstream's metadata
   */
  public getSherpaPoliciesData(submissionId: string, sectionId: string): Observable<WorkspaceitemSectionSherpaPoliciesObject> {

    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(
      filter((state) => isNotUndefined(state)),
      distinctUntilChanged());
  }
}
