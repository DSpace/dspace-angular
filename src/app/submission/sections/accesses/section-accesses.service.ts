import { Injectable } from '@angular/core';
import { isNotUndefined } from '@dspace/shared/utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';

import { WorkspaceitemSectionAccessesObject } from '@dspace/core';
import { submissionSectionDataFromIdSelector } from '@dspace/core';
import { SubmissionState } from '@dspace/core';

/**
 * A service that provides methods to handle submission item's accesses condition state.
 */
@Injectable({ providedIn: 'root' })
export class SectionAccessesService {

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
  public getAccessesData(submissionId: string, sectionId: string): Observable<WorkspaceitemSectionAccessesObject> {

    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(
      filter((state) => isNotUndefined(state)),
      distinctUntilChanged());
  }
}
