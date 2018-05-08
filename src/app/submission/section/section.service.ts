import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';

import { hasValue, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import {
  DisableSectionAction,
  EnableSectionAction,
  InertSectionErrorsAction,
  UpdateSectionDataAction
} from '../objects/submission-objects.actions';
import {
  SubmissionObjectEntry,
  SubmissionSectionError,
  SubmissionSectionObject
} from '../objects/submission-objects.reducer';
import { submissionObjectFromIdSelector, submissionSectionFromIdSelector } from '../selectors';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';

@Injectable()
export class SectionService {

  constructor(private scrollToService: ScrollToService,
              private store: Store<SubmissionState>) {
  }

  public getSectionState(submissionId, sectionId): Observable<SubmissionSectionObject> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId))
      .filter((sectionObj) => hasValue(sectionObj))
      .map((sectionObj: SubmissionSectionObject) => sectionObj)
      .distinctUntilChanged();
  }

  public isSectionValid(submissionId, sectionId): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId))
      .filter((sectionObj) => hasValue(sectionObj))
      .map((sectionObj: SubmissionSectionObject) => sectionObj.isValid)
      .distinctUntilChanged();
  }

  public isSectionEnabled(submissionId, sectionId): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId))
      .filter((sectionObj) => hasValue(sectionObj))
      .map((sectionObj: SubmissionSectionObject) => sectionObj.enabled)
      .distinctUntilChanged();
  }

  public isSectionReadOnly(submissionId: string, sectionId: string, submissionScope: SubmissionScopeType): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId))
      .filter((sectionObj) => hasValue(sectionObj))
      .map((sectionObj: SubmissionSectionObject) => {
        return sectionObj.visibility.other === 'READONLY' && submissionScope !== SubmissionScopeType.WorkspaceItem
      })
      .distinctUntilChanged();
  }

  public isSectionAvailable(submissionId, sectionId): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submissionState: SubmissionObjectEntry) => isNotUndefined(submissionState))
      .map((submissionState: SubmissionObjectEntry) => {
        return isNotUndefined(submissionState.sections) && isNotUndefined(submissionState.sections[sectionId]);
      })
      .distinctUntilChanged();
  }

  public addSection(submissionId: string,
                    sectionId: string) {
    this.store.dispatch(new EnableSectionAction(submissionId, sectionId));
    const config: ScrollToConfigOptions = {
      target: sectionId,
      offset: -70
    };

    this.scrollToService.scrollTo(config);
  }

  public removeSection(submissionId, sectionId) {
    this.store.dispatch(new DisableSectionAction(submissionId, sectionId))
  }

  public updateSectionData(submissionId, sectionId, data) {
    if (isNotEmpty(data)) {
      this.isSectionAvailable(submissionId, sectionId)
        .take(1)
        .filter((loaded) => loaded)
        .subscribe((loaded: boolean) => {
          this.store.dispatch(new UpdateSectionDataAction(submissionId, sectionId, data, []));
        });
    }
  }

  public setSectionError(submissionId: string, sectionId: string, errors: SubmissionSectionError[]) {
    this.store.dispatch(new InertSectionErrorsAction(submissionId, sectionId, errors));
  }
}
