import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { submissionSelector, SubmissionState } from './submission.reducers';
import { hasValue, isEmpty, isNotUndefined } from '../shared/empty.util';
import { SaveSubmissionFormAction } from './objects/submission-objects.actions';
import {
  SubmissionObjectEntry, SubmissionSectionEntry,
  SubmissionSectionObject
} from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionRestService } from './submission-rest.service';
import { Router } from '@angular/router';
import { SectionService } from './section/section.service';
import { SubmissionSectionModel } from '../core/shared/config/config-submission-section.model';
import { SectionDataObject } from './section/section-data.model';

export const WORKSPACE_SCOPE = 'WORKSPACE';
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
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
      .map((submission: SubmissionObjectEntry) => submission.activeSection);
  }

  getSubmissionSections(submissionId: string): Observable<SectionDataObject[]> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading)
      .take(1)
      .map((submission: SubmissionObjectEntry) => submission.sections)
      .map((sections: SubmissionSectionEntry) => {
        const availableSections: SectionDataObject[] = [];
        Object.keys(sections)
          .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
          .forEach((sectionId) => {
            const sectionObject: SectionDataObject = Object.create({});
            sectionObject.config = sections[sectionId].config;
            sectionObject.mandatory = sections[sectionId].mandatory;
            sectionObject.data = sections[sectionId].data;
            sectionObject.errors = sections[sectionId].errors;
            sectionObject.header = sections[sectionId].header;
            sectionObject.id = sectionId;
            sectionObject.sectionType = sections[sectionId].sectionType;
            availableSections.push(sectionObject);
          });
        return availableSections;
      })
      .startWith([])
      .distinctUntilChanged();
  }

  public getDisabledSectionsList(submissionId: string): Observable<SectionDataObject[]> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading)
      .map((submission: SubmissionObjectEntry) => submission.sections)
      .map((sections: SubmissionSectionEntry) => {
        const disabledSections: SectionDataObject[] = [];
        Object.keys(sections)
          .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
          .filter((sectionId) => !sections[sectionId].enabled)
          .forEach((sectionId) => {
            const sectionObject: SectionDataObject = Object.create({});
            sectionObject.header = sections[sectionId].header;
            sectionObject.id = sectionId;
            disabledSections.push(sectionObject);
          });
        console.log(disabledSections);
        return disabledSections;
      })
      .startWith([])
      .distinctUntilChanged();
  }

  public isSectionHidden(sectionData: SubmissionSectionObject) {
    return (isNotUndefined(sectionData.visibility)
      && sectionData.visibility.main === 'HIDDEN'
      && sectionData.visibility.other === 'HIDDEN');

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
    return (this.getSubmissionObjectLinkName() === 'workspaceitems') ? WORKSPACE_SCOPE : WORKFLOW_SCOPE;
  }

  getSectionsState(submissionId: string): Observable<boolean> {
    return this.store.select(submissionSelector)
      .map((submissions: SubmissionState) => submissions.objects[submissionId])
      .filter((item) => isNotUndefined(item) && isNotUndefined(item.sections))
      .map((item) => item.sections)
      .map((sections) => {
        const states = [];

        if (isNotUndefined(sections)) {
          Object.keys(sections)
            .filter((sectionId) => sections.hasOwnProperty(sectionId))
            .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
            .filter((sectionId) => sections[sectionId].enabled)
            .filter((sectionId) => sections[sectionId].isValid === false)
            .forEach((sectionId) => {
              states.push(sections[sectionId].isValid);
            });
        }

        return !isEmpty(sections) && isEmpty(states);
      })
      .distinctUntilChanged()
      .startWith(false);
  }

  getSubmissionSaveProcessingStatus(submissionId: string): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((state: SubmissionObjectEntry) => isNotUndefined(state))
      .map((state: SubmissionObjectEntry) => state.savePending)
      .distinctUntilChanged()
      .startWith(false);
  }

  getSubmissionDepositProcessingStatus(submissionId: string): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((state: SubmissionObjectEntry) => isNotUndefined(state))
      .map((state: SubmissionObjectEntry) => state.depositPending)
      .distinctUntilChanged()
      .startWith(false);
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
