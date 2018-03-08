import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { submissionSelector, SubmissionState } from './submission.reducers';
import { hasValue, isEmpty, isNotUndefined } from '../shared/empty.util';
import { SaveSubmissionFormAction } from './objects/submission-objects.actions';
import { SubmissionObjectEntry } from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionRestService } from './submission-rest.service';
import { Router } from '@angular/router';

export const SUBMISSION_SCOPE = 'SUBMISSION';
export const WORKFLOW_SCOPE = 'WORKFLOW';

@Injectable()
export class SubmissionService {

  protected autoSaveSub: Subscription;
  protected timerObs: Observable<any>;

  constructor(private router: Router,
              private store: Store<SubmissionState>,
              private restService: SubmissionRestService,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
  }

  depositSubmission(selfUrl: string): Observable<any> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.restService.postToEndpoint('workflowitems', selfUrl, null, options);
  }

  getActiveSectionId(submissionId: string): Observable<string> {
    return this.store.select(submissionSelector)
      .filter((submissions: SubmissionState) => isNotUndefined(submissions.objects[submissionId]))
      .map((submissions: SubmissionState) => submissions.objects[submissionId].activeSection);
  }

  getSectionsEnabled(submissionId: string): Observable<any> {
    return this.store.select(submissionSelector)
      .map((submissions: SubmissionState) => submissions.objects[submissionId]);
  }

  getSubmissionObjectLinkName(): string {
    const url = this.router.routerState.snapshot.url;
    if (url.startsWith('/workspaceitems') || url.startsWith('/submit')) {
      return 'workspaceitems';
    } else {
      return 'workflowitems';
    }
  }

  getSubmissionScope(): string {
    return  (this.getSubmissionObjectLinkName() === 'workspaceitems') ? SUBMISSION_SCOPE : WORKFLOW_SCOPE;
  }

  getSectionsState(submissionId: string): Observable<boolean> {
    return this.getSectionsEnabled(submissionId)
      .filter((item) => isNotUndefined(item) && isNotUndefined(item.sections))
      .map((item) => item.sections)
      .map((sections) => {
        const states = [];

        if (isNotUndefined(sections)) {
          Object.keys(sections)
            .filter((property) => sections.hasOwnProperty(property))
            .filter((property) => sections[property].isValid === false)
            .forEach((property) => {
              states.push(sections[property].isValid)
            });
        }

        return !isEmpty(sections) && isEmpty(states);
      })
      .distinctUntilChanged()
      .startWith(false)
  }

  getSubmissionSaveProcessingStatus(submissionId: string): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((state: SubmissionObjectEntry) => isNotUndefined(state))
      .map((state: SubmissionObjectEntry) => state.savePending)
      .distinctUntilChanged()
      .startWith(false)
  }

  getSubmissionDepositProcessingStatus(submissionId: string): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((state: SubmissionObjectEntry) => isNotUndefined(state))
      .map((state: SubmissionObjectEntry) => state.depositPending)
      .distinctUntilChanged()
      .startWith(false)
  }

  redirectToMyDSpace() {
    this.router.navigate(['/mydspace']);
  }

  startAutoSave(submissionId) {
    this.stopAutoSave();
    console.log('AUTOSAVE ON!!!');
    // AUTOSAVE submission
    // Retrieve interval from config and convert to milliseconds
    const duration = this.EnvConfig.submission.autosave.timer * (1000 * 60);
    // const duration = (1000 * 30);
    // Dispatch save action after given duration
    this.timerObs = Observable.timer(duration, duration);
    this.autoSaveSub = this.timerObs
      .subscribe(() => this.store.dispatch(new SaveSubmissionFormAction(submissionId)));
  }

  stopAutoSave() {
    if (hasValue(this.autoSaveSub)) {
      console.log('AUTOSAVE OFFF!!!');
      this.autoSaveSub.unsubscribe();
      this.autoSaveSub = null;
    }
  }
}
