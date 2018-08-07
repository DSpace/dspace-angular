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
  SetWorkflowDuplicatedAction,
  SetWorkflowDuplicatedErrorAction,
  SetWorkflowDuplicatedSuccessAction,
  SetWorkspaceDuplicatedAction,
  SetWorkspaceDuplicatedErrorAction,
  SetWorkspaceDuplicatedSuccessAction,
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
import { Action, Store } from '@ngrx/store';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { TranslateService } from '@ngx-translate/core';
import { DeduplicationService } from '../sections/deduplication/deduplication.service';
import { SubmissionState } from '../submission.reducers';
import { SubmissionObjectEntry } from './submission-objects.reducer';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';
import parseSectionErrors from '../utils/parseSectionErrors';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() loadForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM)
    .map((action: InitSubmissionFormAction) => {
      const definition = action.payload.submissionDefinition;
      const mappedActions = [];
      definition.sections.forEach((sectionDefinition: SubmissionSectionModel, index: number) => {
        const sectionId = sectionDefinition._links.self.substr(sectionDefinition._links.self.lastIndexOf('/') + 1);
        const config = sectionDefinition._links.config || '';
        const enabled = sectionDefinition.mandatory || (isNotEmpty(action.payload.sections) && action.payload.sections.hasOwnProperty(sectionId));
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
    .mergeMap((actions) => {
      return Observable.from(actions);
    });

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
        .catch((e) => Observable.of(new DepositSubmissionErrorAction(action.payload.submissionId)));
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
        .catch((e) => Observable.of(new DiscardSubmissionErrorAction(action.payload.submissionId)));
    });

  @Effect({dispatch: false}) discardSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS)
    .do(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.discard_success_notice')))
    .do(() => this.submissionService.redirectToMyDSpace());

  @Effect({dispatch: false}) discardSubmissionError$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR)
    .do(() => this.notificationsService.error(null, this.translate.get('submission.sections.general.discard_error_notice')));

  @Effect()
  public wsDuplication: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION)
    .map((action: SetWorkspaceDuplicatedAction) => {
      // return this.deduplicationService.setWorkspaceDuplicated(action.payload)
      //   .first()
      //   .map((response) => {
      console.log('Effect of SET_WORKSPACE_DUPLICATION');
      // TODO JSON PATCH
      // const pathCombiner = new JsonPatchOperationPathCombiner('sections', 'deduplication');
      // const path = ''; // `metadata/${metadataKey}`; // TODO
      // this.operationsBuilder.add(pathCombiner.getPath(path), action.payload, true);
      return new SetWorkspaceDuplicatedSuccessAction(action.payload);
    })
    .catch((error) => Observable.of(new SetWorkspaceDuplicatedErrorAction(error)));

  @Effect({dispatch: false})
  public wsDuplicationSuccess: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION_SUCCESS)
    // TODO
    .do((action: SetWorkspaceDuplicatedAction) => {
      console.log('Effect of SET_WORKSPACE_DUPLICATION_SUCCESS');
      this.deduplicationService.setWorkspaceDuplicationSuccess(action.payload);
    });

  @Effect({dispatch: false})
  public wsDuplicationError: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION_ERROR)
    .do((action: SetWorkspaceDuplicatedAction) => {
      console.log('Effect of SET_WORKSPACE_DUPLICATION_ERROR');
      this.deduplicationService.setWorkspaceDuplicationError(action.payload);
    });

  @Effect()
  public wfDuplication: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION)
    .map((action: SetWorkflowDuplicatedAction) => {
      // return this.deduplicationService.setWorkflowDuplicated(action.payload)
      //   .first()
      //   .map((response) => {
      console.log('Effect of SET_WORKFLOW_DUPLICATION');
      // TODO JSON PATCH
      // const pathCombiner = new JsonPatchOperationPathCombiner('sections', 'deduplication');
      // const path = ''; // `metadata/${metadataKey}`; // TODO
      // this.operationsBuilder.add(pathCombiner.getPath(path), action.payload, true);
      return new SetWorkflowDuplicatedSuccessAction(action.payload);
    })
    .catch((error) => Observable.of(new SetWorkflowDuplicatedErrorAction(error)));

  @Effect({dispatch: false})
  public wfDuplicationSuccess: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION_SUCCESS)
    // TODO
    .do((action: SetWorkflowDuplicatedAction) => {
      console.log('Effect of SET_WORKFLOW_DUPLICATION_SUCCESS');
      this.deduplicationService.setWorkflowDuplicationSuccess(action.payload);
    });

  @Effect({dispatch: false})
  public wfDuplicationError: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION_ERROR)
    .do((action: SetWorkflowDuplicatedAction) => {
      console.log('Effect of SET_WORKFLOW_DUPLICATION_ERROR');
      this.deduplicationService.setWorkflowDuplicationError(action.payload);
    });

  constructor(private actions$: Actions,
              private notificationsService: NotificationsService,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private sectionService: SectionsService,
              private store$: Store<any>,
              private submissionService: SubmissionService,
              private deduplicationService: DeduplicationService,
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

  protected parseSaveResponse(currentState: SubmissionObjectEntry, response: SubmissionObject[], submissionId: string) {
    const mappedActions = [];

    if (isNotEmpty(response)) {
      this.notificationsService.success(null, this.translate.get('submission.sections.general.save_success_notice'));

      // to avoid dispatching an action for every error, create an array of errors per section
      response.forEach((item: Workspaceitem | Workflowitem) => {

        let errorsList = Object.create({});
        const {errors} = item;

        if (errors && !isEmpty(errors)) {
          errorsList = parseSectionErrors(errors);
          this.notificationsService.warning(null, this.translate.get('submission.sections.general.sections_not_valid'));
        }

        const sections = (item.sections && isNotEmpty(item.sections)) ? item.sections : {};

        const sectionsKeys: string[] = union(Object.keys(sections), Object.keys(errorsList));

        sectionsKeys
          .forEach((sectionId) => {
            const sectionErrors = errorsList[sectionId] || [];
            const sectionData = sections[sectionId] || {};
            if (!currentState.sections[sectionId].enabled) {
              this.translate.get('submission.sections.general.metadata-extracted-new-section', {sectionId})
                .take(1)
                .subscribe((m) => {
                  this.notificationsService.info(null, m, null, true);
                });
            }
            mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sectionData, sectionErrors));
          });

      });

    }

    return mappedActions;
  }

}
