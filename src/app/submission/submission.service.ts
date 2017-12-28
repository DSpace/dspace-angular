import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { submissionSelector, SubmissionState } from './submission.reducers';

// utils
import { isEmpty, isNotEmpty, isNotUndefined } from '../shared/empty.util';
import { WorkspaceItemError, WorkspaceitemObject } from './models/workspaceitem.model';
import { SubmissionRestService } from './submission-rest.service';
import { SectionService } from './section/section.service';
import { default as parseSectionErrorPaths, SectionErrorPath } from './utils/parseSectionErrorPaths';
import { InertSectionErrorsAction } from './objects/submission-objects.actions';
import { SubmissionObjectEntry, SubmissionObjectState } from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';

@Injectable()
export class SubmissionService {

  constructor(private sectionService: SectionService,
              private submissionRestService: SubmissionRestService,
              private store: Store<SubmissionState>) {
  }

  getSectionsEnabled(submissionId: string): Observable<any> {
    return this.store.select(submissionSelector)
      .map((submissions: SubmissionState) => submissions.objects[ submissionId ]);
  }

  getSectionsState(submissionId: string): Observable<boolean> {
    return this.getSectionsEnabled(submissionId)
      .filter((item) => isNotUndefined(item))
      .map((item) => item.sections)
      .map((sections) => {
        const states = [];

        Object.keys(sections)
          .filter((property) => sections.hasOwnProperty(property))
          .filter((property) => sections[ property ].isValid === false)
          .forEach((property) => {
            states.push(sections[ property ].isValid)
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

  saveSubmission(submissionId) {
    this.submissionRestService.jsonPatchByResourceType(submissionId, 'sections')
      .subscribe((response) => {
        if (isNotEmpty(response)) {
          const errorsList = {};

          // to avoid dispatching an action for every error, create an array of errors per section
          (response as WorkspaceitemObject[]).forEach((item: WorkspaceitemObject) => {
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
