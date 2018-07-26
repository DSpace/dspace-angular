import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { submissionSelector, SubmissionState } from './submission.reducers';
import { hasValue, isEmpty, isNotUndefined } from '../shared/empty.util';
import { SaveSubmissionFormAction } from './objects/submission-objects.actions';
import {
  SubmissionObjectEntry,
  SubmissionSectionEntry,
  SubmissionSectionObject
} from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionRestService } from './submission-rest.service';
import { Router } from '@angular/router';
import { SectionDataObject } from './sections/models/section-data.model';
import { SubmissionScopeType } from '../core/submission/submission-scope-type';
import { SubmissionObject } from '../core/submission/models/submission-object.model';

@Injectable()
export class SubmissionService {

  protected autoSaveSub: Subscription;
  protected timerObs: Observable<any>;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected restService: SubmissionRestService,
              protected router: Router,
              protected store: Store<SubmissionState>) {
  }

  createSubmission(): Observable<SubmissionObject> {
    return this.restService.postToEndpoint('workspaceitems', {})
      .map((workspaceitems) => workspaceitems[0])
      .catch(() => Observable.of({}))
  }

  depositSubmission(selfUrl: string): Observable<any> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.restService.postToEndpoint('workflowitems', selfUrl, null, options);
  }

  discardSubmission(submissionId: string): Observable<any> {
    return this.restService.deleteById(submissionId);
  }

  getActiveSectionId(submissionId: string): Observable<string> {
    return this.getSubmissionObject(submissionId)
      .map((submission: SubmissionObjectEntry) => submission.activeSection);
  }

  getSubmissionObject(submissionId: string): Observable<SubmissionObjectEntry> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
  }

  getSubmissionSections(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId)
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

  getDisabledSectionsList(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId)
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
        return disabledSections;
      })
      .startWith([])
      .distinctUntilChanged();
  }

  isSectionHidden(sectionData: SubmissionSectionObject) {
    return (isNotUndefined(sectionData.visibility)
      && sectionData.visibility.main === 'HIDDEN'
      && sectionData.visibility.other === 'HIDDEN');

  }

  isSubmissionLoading(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId)
      .map((submission: SubmissionObjectEntry) => submission.isLoading)
      .distinctUntilChanged()
  }

  getSubmissionObjectLinkName(): string {
    const url = this.router.routerState.snapshot.url;
    if (url.startsWith('/workspaceitems') || url.startsWith('/submit')) {
      return 'workspaceitems';
    } else if (url.startsWith('/workflowitems')) {
      return 'workflowitems';
    } else {
      return 'edititems';
    }
  }

  getSubmissionScope(): SubmissionScopeType {
    let scope: SubmissionScopeType;
    switch (this.getSubmissionObjectLinkName()) {
      case 'workspaceitems':
        scope = SubmissionScopeType.WorkspaceItem;
        break;
      case 'workflowitems':
        scope = SubmissionScopeType.WorkflowItem;
        break;
      case 'edititems':
        scope = SubmissionScopeType.EditItem;
        break;
    }
    return scope;
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

  retrieveSubmission(submissionId): Observable<SubmissionObject> {
    return this.restService.getDataById(this.getSubmissionObjectLinkName(), submissionId)
      .filter((submissionObjects: SubmissionObject[]) => isNotUndefined(submissionObjects))
      .take(1)
      .map((submissionObjects: SubmissionObject[]) => submissionObjects[0]);
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
