import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { union } from 'lodash';

import {
  CompleteInitSubmissionFormAction,
  DepositSubmissionAction,
  DepositSubmissionErrorAction,
  DepositSubmissionSuccessAction,
  DiscardSubmissionErrorAction,
  DiscardSubmissionSuccessAction,
  InitSectionAction,
  InitSubmissionFormAction,
  ResetSubmissionFormAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveForLaterSubmissionFormSuccessAction,
  SaveSubmissionFormAction,
  SaveSubmissionFormErrorAction,
  SaveSubmissionFormSuccessAction,
  SaveSubmissionSectionFormAction,
  SaveSubmissionSectionFormErrorAction,
  SaveSubmissionSectionFormSuccessAction,
  SubmissionObjectActionTypes,
  UpdateSectionDataAction
} from './submission-objects.actions';
import { SectionsService } from '../sections/sections.service';
import { isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { Observable } from 'rxjs/Observable';
import { JsonPatchOperationsService } from '../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../submission.service';
import { Store } from '@ngrx/store';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionState } from '../submission.reducers';
import { SubmissionObjectEntry } from './submission-objects.reducer';
import { SubmissionSectionModel } from '../../core/config/models/config-submission-section.model';
import parseSectionErrors from '../utils/parseSectionErrors';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { WorkspaceitemSectionUploadObject } from '../../core/submission/models/workspaceitem-section-upload.model';
import { SectionsType } from '../sections/sections-type';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() loadForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM)
    .map((action: InitSubmissionFormAction) => {
      const definition = action.payload.submissionDefinition;
      const mappedActions = [];
      definition.sections.page.forEach((sectionDefinition: SubmissionSectionModel) => {
        const sectionId = sectionDefinition._links.self.substr(sectionDefinition._links.self.lastIndexOf('/') + 1);
        const config = sectionDefinition._links.config || '';
        const enabled = (sectionDefinition.mandatory) || (isNotEmpty(action.payload.sections) && action.payload.sections.hasOwnProperty(sectionId));
        const sectionData = (isNotUndefined(action.payload.sections) && isNotUndefined(action.payload.sections[sectionId])) ? action.payload.sections[sectionId] : Object.create(null);
        const sectionErrors = null;
        mappedActions.push(
          new InitSectionAction(
            action.payload.submissionId,
            sectionId,
            sectionDefinition.header,
            config,
            sectionDefinition.mandatory,
            sectionDefinition.sectionType,
            sectionDefinition.visibility,
            enabled,
            sectionData,
            sectionErrors
          )
        )
      });
      return {action: action, definition: definition, mappedActions: mappedActions};
    })
    .mergeMap((result) => {
      return Observable.from(
        result.mappedActions.concat(
          new CompleteInitSubmissionFormAction(result.action.payload.submissionId)
        ));
    });

  @Effect() resetForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.RESET_SUBMISSION_FORM)
    .map((action: ResetSubmissionFormAction) =>
      new InitSubmissionFormAction(
        action.payload.collectionId,
        action.payload.submissionId,
        action.payload.selfUrl,
        action.payload.submissionDefinition,
        action.payload.sections,
        null
      ));

  @Effect() saveSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM)
    .switchMap((action: SaveSubmissionFormAction) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections')
        .map((response: SubmissionObject[]) => new SaveSubmissionFormSuccessAction(action.payload.submissionId, response))
        .catch(() => Observable.of(new SaveSubmissionFormErrorAction(action.payload.submissionId)));
    });

  @Effect() saveForLaterSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM)
    .switchMap((action: SaveForLaterSubmissionFormAction) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections')
        .map((response: SubmissionObject[]) => new SaveForLaterSubmissionFormSuccessAction(action.payload.submissionId, response))
        .catch(() => Observable.of(new SaveSubmissionFormErrorAction(action.payload.submissionId)));
    });

  @Effect() saveSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS, SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS)
    .withLatestFrom(this.store$)
    .map(([action, currentState]: [SaveSubmissionFormSuccessAction | SaveSubmissionSectionFormSuccessAction, any]) => {
      return this.parseSaveResponse((currentState.submission as SubmissionState).objects[action.payload.submissionId], action.payload.submissionObject, action.payload.submissionId);
    })
    .mergeMap((actions) => Observable.from(actions));

  @Effect() saveSection$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM)
    .switchMap((action: SaveSubmissionSectionFormAction) => {
      return this.operationsService.jsonPatchByResourceID(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections',
        action.payload.sectionId)
        .map((response: SubmissionObject[]) => new SaveSubmissionSectionFormSuccessAction(action.payload.submissionId, response))
        .catch(() => Observable.of(new SaveSubmissionSectionFormErrorAction(action.payload.submissionId)));
    });

  @Effect() saveAndDepositSection$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION)
    .withLatestFrom(this.store$)
    .switchMap(([action, currentState]: [SaveAndDepositSubmissionAction, any]) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections')
        .map((response: SubmissionObject[]) => {
          if (this.canDeposit(response)) {
            return new DepositSubmissionAction(action.payload.submissionId);
          } else {
            this.notificationsService.warning(null, this.translate.get('submission.sections.general.sections_not_valid'));
            return this.parseSaveResponse((currentState.submission as SubmissionState).objects[action.payload.submissionId], response, action.payload.submissionId);
          }
        })
        .catch(() => Observable.of(new SaveSubmissionSectionFormErrorAction(action.payload.submissionId)));
    });

  @Effect() depositSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION)
    .withLatestFrom(this.store$)
    .switchMap(([action, state]: [DepositSubmissionAction, any]) => {
      return this.submissionService.depositSubmission(state.submission.objects[action.payload.submissionId].selfUrl)
        .map(() => new DepositSubmissionSuccessAction(action.payload.submissionId))
        .catch(() => Observable.of(new DepositSubmissionErrorAction(action.payload.submissionId)));
    });

  @Effect({dispatch: false}) SaveForLaterSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS)
    .do(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.save_success_notice')))
    .do(() => this.submissionService.redirectToMyDSpace());

  @Effect({dispatch: false}) depositSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS)
    .do(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.deposit_success_notice')))
    .do(() => this.submissionService.redirectToMyDSpace());

  @Effect({dispatch: false}) depositSubmissionError$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR)
    .do(() => this.notificationsService.error(null, this.translate.get('submission.sections.general.deposit_error_notice')));

  @Effect() discardSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION)
    .switchMap((action: DepositSubmissionAction) => {
      return this.submissionService.discardSubmission(action.payload.submissionId)
        .map(() => new DiscardSubmissionSuccessAction(action.payload.submissionId))
        .catch(() => Observable.of(new DiscardSubmissionErrorAction(action.payload.submissionId)));
    });

  @Effect({dispatch: false}) discardSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS)
    .do(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.discard_success_notice')))
    .do(() => this.submissionService.redirectToMyDSpace());

  @Effect({dispatch: false}) discardSubmissionError$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR)
    .do(() => this.notificationsService.error(null, this.translate.get('submission.sections.general.discard_error_notice')));

  constructor(private actions$: Actions,
              private notificationsService: NotificationsService,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private sectionService: SectionsService,
              private store$: Store<any>,
              private submissionService: SubmissionService,
              private translate: TranslateService) {
  }

  protected canDeposit(response: SubmissionObject[]) {
    let canDeposit = true;

    if (isNotEmpty(response)) {
      response.forEach((item: Workspaceitem | Workflowitem) => {
        const {errors} = item;

        if (errors && !isEmpty(errors)) {
          canDeposit = false;
        }
      });
    }
    return canDeposit;
  }

  protected parseSaveResponse(currentState: SubmissionObjectEntry, response: SubmissionObject[], submissionId: string, notify: boolean = true) {
    const mappedActions = [];

    if (isNotEmpty(response)) {
      if (notify) {
        this.notificationsService.success(null, this.translate.get('submission.sections.general.save_success_notice'));
      }

      // to avoid dispatching an action for every error, create an array of errors per section
      response.forEach((item: Workspaceitem | Workflowitem) => {

        let errorsList = Object.create({});
        const {errors} = item;

        if (errors && !isEmpty(errors)) {
          errorsList = parseSectionErrors(errors);
          if (notify) {
            this.notificationsService.warning(null, this.translate.get('submission.sections.general.sections_not_valid'));
          }
        }

        const sections: WorkspaceitemSectionsObject = (item.sections && isNotEmpty(item.sections)) ? item.sections : {};
        const sectionsKeys: string[] = union(Object.keys(sections), Object.keys(errorsList));

        for (const sectionId of sectionsKeys) {
          const sectionErrors = errorsList[sectionId] || [];
          const sectionData = sections[sectionId] || {};

          // When Upload section is disabled, add to submission only if there are files
          if (currentState.sections[sectionId].sectionType === SectionsType.Upload
            && isEmpty((sectionData as WorkspaceitemSectionUploadObject).files)
            && !currentState.sections[sectionId].enabled) {
            continue;
          }

          if (notify && !currentState.sections[sectionId].enabled) {
            this.submissionService.notifyNewSection(submissionId, sectionId, currentState.sections[sectionId].sectionType);
          }
          mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sectionData, sectionErrors));
        }

      });

    }

    return mappedActions;
  }

}
