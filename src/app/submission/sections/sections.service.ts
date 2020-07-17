import { Injectable } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { isEqual } from 'lodash';

import { SubmissionState } from '../submission.reducers';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import {
  DisableSectionAction,
  EnableSectionAction,
  InertSectionErrorsAction,
  RemoveSectionErrorsAction,
  SectionStatusChangeAction,
  UpdateSectionDataAction
} from '../objects/submission-objects.actions';
import { SubmissionObjectEntry, SubmissionSectionError, SubmissionSectionObject } from '../objects/submission-objects.reducer';
import { submissionObjectFromIdSelector, submissionSectionDataFromIdSelector, submissionSectionErrorsFromIdSelector, submissionSectionFromIdSelector } from '../selectors';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import parseSectionErrorPaths, { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import { FormAddError, FormClearErrorsAction, FormRemoveErrorAction } from '../../shared/form/form.actions';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionService } from '../submission.service';
import { WorkspaceitemSectionDataType } from '../../core/submission/models/workspaceitem-sections.model';

/**
 * A service that provides methods used in submission process.
 */
@Injectable()
export class SectionsService {

  /**
   * Initialize service variables
   * @param {NotificationsService} notificationsService
   * @param {ScrollToService} scrollToService
   * @param {SubmissionService} submissionService
   * @param {Store<SubmissionState>} store
   * @param {TranslateService} translate
   */
  constructor(private notificationsService: NotificationsService,
              private scrollToService: ScrollToService,
              private submissionService: SubmissionService,
              private store: Store<SubmissionState>,
              private translate: TranslateService) {
  }

  /**
   * Compare the list of the current section errors with the previous one,
   * and dispatch actions to add/remove to/from the section state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The workspaceitem self url
   * @param formId
   *    The [SubmissionDefinitionsModel] that define submission configuration
   * @param currentErrors
   *    The [SubmissionSectionError] that define submission sections init data
   * @param prevErrors
   *    The [SubmissionSectionError] that define submission sections init errors
   */
  public checkSectionErrors(
    submissionId: string,
    sectionId: string,
    formId: string,
    currentErrors: SubmissionSectionError[],
    prevErrors: SubmissionSectionError[] = []) {
    // Remove previous error list if the current is empty
    if (isEmpty(currentErrors)) {
      this.store.dispatch(new RemoveSectionErrorsAction(submissionId, sectionId));
      this.store.dispatch(new FormClearErrorsAction(formId));
    } else if (!isEqual(currentErrors, prevErrors)) { // compare previous error list with the current one
      const dispatchedErrors = [];

      // Iterate over the current error list
      currentErrors.forEach((error: SubmissionSectionError) => {
        const errorPaths: SectionErrorPath[] = parseSectionErrorPaths(error.path);

        errorPaths.forEach((path: SectionErrorPath) => {
          if (path.fieldId) {
            const fieldId = path.fieldId.replace(/\./g, '_');

            // Dispatch action to add form error to the state;
            const formAddErrorAction = new FormAddError(formId, fieldId, path.fieldIndex, error.message);
            this.store.dispatch(formAddErrorAction);
            dispatchedErrors.push(fieldId);
          }
        });
      });

      // Itereate over the previous error list
      prevErrors.forEach((error: SubmissionSectionError) => {
        const errorPaths: SectionErrorPath[] = parseSectionErrorPaths(error.path);

        errorPaths.forEach((path: SectionErrorPath) => {
          if (path.fieldId) {
            const fieldId = path.fieldId.replace(/\./g, '_');

            if (!dispatchedErrors.includes(fieldId)) {
              // Dispatch action to remove form error from the state;
              const formRemoveErrorAction = new FormRemoveErrorAction(formId, fieldId, path.fieldIndex);
              this.store.dispatch(formRemoveErrorAction);
            }
          }
        });
      });
    }
  }

  /**
   * Dispatch a new [RemoveSectionErrorsAction]
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   */
  public dispatchRemoveSectionErrors(submissionId, sectionId) {
    this.store.dispatch(new RemoveSectionErrorsAction(submissionId, sectionId));
  }

  /**
   * Return the data object for the specified section
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<WorkspaceitemSectionDataType>
   *    observable of [WorkspaceitemSectionDataType]
   */
  public getSectionData(submissionId: string, sectionId: string): Observable<WorkspaceitemSectionDataType> {
    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(
      distinctUntilChanged());
  }

  /**
   * Return the error list object data for the specified section
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<SubmissionSectionError>
   *    observable of array of [SubmissionSectionError]
   */
  public getSectionErrors(submissionId: string, sectionId: string): Observable<SubmissionSectionError[]> {
    return this.store.select(submissionSectionErrorsFromIdSelector(submissionId, sectionId)).pipe(
      distinctUntilChanged());
  }

  /**
   * Return the state object for the specified section
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<SubmissionSectionObject>
   *    observable of [SubmissionSectionObject]
   */
  public getSectionState(submissionId: string, sectionId: string): Observable<SubmissionSectionObject> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(
      filter((sectionObj: SubmissionSectionObject) => hasValue(sectionObj)),
      map((sectionObj: SubmissionSectionObject) => sectionObj),
      distinctUntilChanged(),
      );
  }

  /**
   * Check if a given section is valid
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<boolean>
   *    Emits true whenever a given section should be valid
   */
  public isSectionValid(submissionId: string, sectionId: string): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(
      filter((sectionObj) => hasValue(sectionObj)),
      map((sectionObj: SubmissionSectionObject) => sectionObj.isValid),
      distinctUntilChanged());
  }

  /**
   * Check if a given section is active
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<boolean>
   *    Emits true whenever a given section should be active
   */
  public isSectionActive(submissionId: string, sectionId: string): Observable<boolean> {
    return this.submissionService.getActiveSectionId(submissionId).pipe(
      map((activeSectionId: string) => sectionId === activeSectionId),
      distinctUntilChanged());
  }

  /**
   * Check if a given section is enabled
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<boolean>
   *    Emits true whenever a given section should be enabled
   */
  public isSectionEnabled(submissionId: string, sectionId: string): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(
      filter((sectionObj) => hasValue(sectionObj)),
      map((sectionObj: SubmissionSectionObject) => sectionObj.enabled),
      distinctUntilChanged());
  }

  /**
   * Check if a given section is a read only section
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param submissionScope
   *    The submission scope
   * @return Observable<boolean>
   *    Emits true whenever a given section should be read only
   */
  public isSectionReadOnly(submissionId: string, sectionId: string, submissionScope: SubmissionScopeType): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(
      filter((sectionObj) => hasValue(sectionObj)),
      map((sectionObj: SubmissionSectionObject) => {
        return isNotEmpty(sectionObj.visibility)
          && sectionObj.visibility.other === 'READONLY'
          && submissionScope !== SubmissionScopeType.WorkspaceItem
      }),
      distinctUntilChanged());
  }

  /**
   * Check if a given section is a read only available
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @return Observable<boolean>
   *    Emits true whenever a given section should be available
   */
  public isSectionAvailable(submissionId: string, sectionId: string): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId)).pipe(
      filter((submissionState: SubmissionObjectEntry) => isNotUndefined(submissionState)),
      map((submissionState: SubmissionObjectEntry) => {
        return isNotUndefined(submissionState.sections) && isNotUndefined(submissionState.sections[sectionId]);
      }),
      distinctUntilChanged());
  }

  /**
   * Dispatch a new [EnableSectionAction] to add a new section and move page target to it
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   */
  public addSection(submissionId: string, sectionId: string) {
    this.store.dispatch(new EnableSectionAction(submissionId, sectionId));
    const config: ScrollToConfigOptions = {
      target: sectionId,
      offset: -70
    };

    this.scrollToService.scrollTo(config);
  }

  /**
   * Dispatch a new [DisableSectionAction] to remove section
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   */
  public removeSection(submissionId: string, sectionId: string) {
    this.store.dispatch(new DisableSectionAction(submissionId, sectionId))
  }

  /**
   * Dispatch a new [UpdateSectionDataAction] to update section state with new data and errors
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param data
   *    The section data
   * @param errors
   *    The list of section errors
   */
  public updateSectionData(submissionId: string, sectionId: string, data: WorkspaceitemSectionDataType, errors: SubmissionSectionError[] = []) {
    if (isNotEmpty(data)) {
      const isAvailable$ = this.isSectionAvailable(submissionId, sectionId);
      const isEnabled$ = this.isSectionEnabled(submissionId, sectionId);

      combineLatest(isAvailable$, isEnabled$).pipe(
        take(1),
        filter(([available, enabled]: [boolean, boolean]) => available))
        .subscribe(([available, enabled]: [boolean, boolean]) => {
          this.store.dispatch(new UpdateSectionDataAction(submissionId, sectionId, data, errors));
        });
    }
  }

  /**
   * Dispatch a new [InertSectionErrorsAction] to update section state with new error
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param error
   *    The section error
   */
  public setSectionError(submissionId: string, sectionId: string, error: SubmissionSectionError) {
    this.store.dispatch(new InertSectionErrorsAction(submissionId, sectionId, error));
  }

  /**
   * Dispatch a new [SectionStatusChangeAction] to update section state with new status
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param status
   *    The section status
   */
  public setSectionStatus(submissionId: string, sectionId: string, status: boolean) {
    this.store.dispatch(new SectionStatusChangeAction(submissionId, sectionId, status));
  }
}
