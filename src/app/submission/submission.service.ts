import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { submissionSelector, SubmissionState } from './submission.reducers';
// utils
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../shared/empty.util';
import { WorkspaceItemError, Workspaceitem } from '../core/submission/models/workspaceitem.model';
import { SubmissionRestService } from './submission-rest.service';
import { SectionService } from './section/section.service';
import { default as parseSectionErrorPaths, SectionErrorPath } from './utils/parseSectionErrorPaths';
import { InertSectionErrorsAction, SaveSubmissionFormAction } from './objects/submission-objects.actions';
import { SubmissionObjectEntry } from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';

@Injectable()
export class SubmissionService {

  protected autoSaveSub: Subscription;
  protected timerObs: Observable<any>;

  constructor(private sectionService: SectionService,
              private submissionRestService: SubmissionRestService,
              private store: Store<SubmissionState>,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
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

  getSectionsState(submissionId: string): Observable<boolean> {
    return this.getSectionsEnabled(submissionId)
      .filter((item) => isNotUndefined(item))
      .map((item) => item.sections)
      .map((sections) => {
        const states = [];

        Object.keys(sections)
          .filter((property) => sections.hasOwnProperty(property))
          .filter((property) => sections[property].isValid === false)
          .forEach((property) => {
            states.push(sections[property].isValid)
          });

        return !isEmpty(sections) && isEmpty(states);
      })
      .distinctUntilChanged()
      .startWith(false)
  }

  getSubmissionSaveStatus(submissionId: string): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((state: SubmissionObjectEntry) => isNotUndefined(state))
      .map((state: SubmissionObjectEntry) => state.savePending)
      .distinctUntilChanged()
  }

  startAutoSave(submissionId) {
    // AUTOSAVE submission
    // Retrieve interval from config and convert to milliseconds
    // const duration = this.EnvConfig.submission.autosave.timer * (1000 * 60);
    const duration = (1000 * 60);
    // Dispatch save action after given duration
    this.timerObs = Observable.timer(duration, duration);
    this.autoSaveSub = this.timerObs
      .subscribe(() => this.store.dispatch(new SaveSubmissionFormAction(submissionId)));
  }

  stopAutoSave() {
    if (hasValue(this.autoSaveSub)) {
      this.autoSaveSub.unsubscribe();
    }
  }

  saveSubmission(submissionId) {
    this.submissionRestService.jsonPatchByResourceType(submissionId, 'sections')
      .subscribe((response) => {
        if (isNotEmpty(response)) {
          const errorsList = {};

          // to avoid dispatching an action for every error, create an array of errors per section
          (response as Workspaceitem[]).forEach((item: Workspaceitem) => {
            const {sections} = item;
            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => this.sectionService.updateSectionData(submissionId, sectionId, sections[sectionId]))
            }

            const {errors} = item;

            if (errors && !isEmpty(errors)) {
              errors.forEach((error: WorkspaceItemError) => {
                const paths: SectionErrorPath[] = parseSectionErrorPaths(error.paths);

                paths.forEach((path: SectionErrorPath) => {
                  const sectionError = {path: path.originalPath, message: error.message};
                  if (!errorsList[path.sectionId]) {
                    errorsList[path.sectionId] = {errors: []};
                  }
                  errorsList[path.sectionId].errors.push(sectionError);
                });
              });
            }
          });

          // and now dispatch an action with an array of errors for every section
          if (!isEmpty(errorsList)) {
            Object.keys(errorsList).forEach((sectionId) => {
              const {errors} = errorsList[sectionId];
              const action = new InertSectionErrorsAction(submissionId, sectionId, errors);

              this.store.dispatch(action);
            });
          }
        }
        // this.saving = false;
      });
  }
}
