import { TestBed } from '@angular/core/testing';

import { cold, hot } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { SubmissionObjectEffects } from './submission-objects.effects';
import {
  CompleteInitSubmissionFormAction,
  DepositSubmissionAction,
  DepositSubmissionErrorAction,
  DepositSubmissionSuccessAction, DiscardSubmissionErrorAction, DiscardSubmissionSuccessAction,
  InitSectionAction,
  InitSubmissionFormAction,
  SaveForLaterSubmissionFormSuccessAction,
  SaveSubmissionFormErrorAction,
  SaveSubmissionFormSuccessAction,
  SaveSubmissionSectionFormErrorAction,
  SaveSubmissionSectionFormSuccessAction,
  SubmissionObjectActionTypes,
  UpdateSectionDataAction
} from './submission-objects.actions';
import {
  mockSectionsData,
  mockSectionsDataTwo,
  mockSectionsErrors,
  mockSubmissionCollectionId,
  mockSubmissionDefinition,
  mockSubmissionDefinitionResponse,
  mockSubmissionId,
  mockSubmissionSelfUrl,
  mockSubmissionState,
  mockSubmissionRestResponse
} from '../../shared/mocks/mock-submission';
import { SubmissionSectionModel } from '../../core/config/models/config-submission-section.model';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionJsonPatchOperationsServiceStub } from '../../shared/testing/submission-json-patch-operations-service-stub';
import { SubmissionJsonPatchOperationsService } from '../../core/submission/submission-json-patch-operations.service';
import { SectionsService } from '../sections/sections.service';
import { SectionsServiceStub } from '../../shared/testing/sections-service-stub';
import { SubmissionService } from '../submission.service';
import { SubmissionServiceStub } from '../../shared/testing/submission-service-stub';
import { MockTranslateLoader } from '../../shared/mocks/mock-translate-loader';
import { MockStore } from '../../shared/testing/mock-store';
import { AppState } from '../../app.reducer';
import parseSectionErrors from '../utils/parseSectionErrors';

describe('SubmissionObjectEffects test suite', () => {
  let submissionObjectEffects: SubmissionObjectEffects;
  let actions: Observable<any>;
  let store: MockStore<AppState>;

  const notificationsServiceStub = new NotificationsServiceStub();
  const submissionServiceStub = new SubmissionServiceStub();
  const submissionJsonPatchOperationsServiceStub = new SubmissionJsonPatchOperationsServiceStub();
  const collectionId: string = mockSubmissionCollectionId;
  const submissionId: string = mockSubmissionId;
  const submissionDefinitionResponse: any = mockSubmissionDefinitionResponse;
  const submissionDefinition: any = mockSubmissionDefinition;
  const selfUrl: string = mockSubmissionSelfUrl;
  const submissionState: any = Object.assign({}, mockSubmissionState);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      providers: [
        SubmissionObjectEffects,
        TranslateService,
        { provide: Store, useClass: MockStore },
        provideMockActions(() => actions),
        { provide: NotificationsService, useValue: notificationsServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: SubmissionJsonPatchOperationsService, useValue: submissionJsonPatchOperationsServiceStub },
      ],
    });

    submissionObjectEffects = TestBed.get(SubmissionObjectEffects);
    store = TestBed.get(Store);
  });

  describe('loadForm$', () => {
    it('should return a INIT_SECTION action for each defined section and a COMPLETE_INIT_SUBMISSION_FORM action', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.INIT_SUBMISSION_FORM,
          payload: {
            collectionId: collectionId,
            submissionId: submissionId,
            selfUrl: selfUrl,
            submissionDefinition: submissionDefinition,
            sections: {},
            errors: [],
          }
        }
      });

      const mappedActions = [];
      (submissionDefinitionResponse.sections as SubmissionSectionModel[])
        .forEach((sectionDefinition: SubmissionSectionModel) => {
          const sectionId = sectionDefinition._links.self.href.substr(sectionDefinition._links.self.href.lastIndexOf('/') + 1);
          const config = sectionDefinition._links.config.href || '';
          const enabled = (sectionDefinition.mandatory);
          const sectionData = {};
          const sectionErrors = null;
          mappedActions.push(new InitSectionAction(
            submissionId,
            sectionId,
            sectionDefinition.header,
            config,
            sectionDefinition.mandatory,
            sectionDefinition.sectionType,
            sectionDefinition.visibility,
            enabled,
            sectionData,
            sectionErrors))
        });
      mappedActions.push(new CompleteInitSubmissionFormAction(submissionId));

      const expected = cold('--(bcdefgh)', {
        b: mappedActions[0],
        c: mappedActions[1],
        d: mappedActions[2],
        e: mappedActions[3],
        f: mappedActions[4],
        g: mappedActions[5],
        h: mappedActions[6]
      });

      expect(submissionObjectEffects.loadForm$).toBeObservable(expected);
    });
  });

  describe('resetForm$', () => {
    it('should return a INIT_SUBMISSION_FORM action', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.RESET_SUBMISSION_FORM,
          payload: {
            collectionId: collectionId,
            submissionId: submissionId,
            selfUrl: selfUrl,
            submissionDefinition: submissionDefinition,
            sections: {},
            errors: [],
          }
        }
      });

      const expected = cold('--b-', {
        b: new InitSubmissionFormAction(
          collectionId,
          submissionId,
          selfUrl,
          submissionDefinition,
          {},
          null
        )
      });

      expect(submissionObjectEffects.resetForm$).toBeObservable(expected);
    });
  });

  describe('saveSubmission$', () => {
    it('should return a SAVE_SUBMISSION_FORM_SUCCESS action on success', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.returnValue(observableOf(mockSubmissionRestResponse));
      const expected = cold('--b-', {
        b: new SaveSubmissionFormSuccessAction(
          submissionId,
          mockSubmissionRestResponse as any
        )
      });

      expect(submissionObjectEffects.saveSubmission$).toBeObservable(expected);
    });

    it('should return a SAVE_SUBMISSION_FORM_ERROR action on error', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.callFake(
        () => observableThrowError('Error')
      );
      const expected = cold('--b-', {
        b: new SaveSubmissionFormErrorAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.saveSubmission$).toBeObservable(expected);
    });
  });

  describe('saveForLaterSubmission$', () => {
    it('should return a SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS action on success', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.returnValue(observableOf(mockSubmissionRestResponse));
      const expected = cold('--b-', {
        b: new SaveForLaterSubmissionFormSuccessAction(
          submissionId,
          mockSubmissionRestResponse as any
        )
      });

      expect(submissionObjectEffects.saveForLaterSubmission$).toBeObservable(expected);
    });

    it('should return a SAVE_SUBMISSION_FORM_ERROR action on error', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.callFake(
        () => observableThrowError('Error')
      );
      const expected = cold('--b-', {
        b: new SaveSubmissionFormErrorAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.saveForLaterSubmission$).toBeObservable(expected);
    });
  });

  describe('saveSubmissionSuccess$', () => {

    it('should return a UPLOAD_SECTION_DATA action for each updated section', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      const response = [Object.assign({}, mockSubmissionRestResponse[0], {
        sections: mockSectionsData,
        errors: mockSectionsErrors
      })];
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS,
          payload: {
            submissionId: submissionId,
            submissionObject: response
          }
        }
      });

      const errorsList = parseSectionErrors(mockSectionsErrors);
      const expected = cold('--(bcd)-', {
        b: new UpdateSectionDataAction(
          submissionId,
          'traditionalpageone',
          mockSectionsData.traditionalpageone as any,
          errorsList.traditionalpageone || []
        ),
        c: new UpdateSectionDataAction(
          submissionId,
          'license',
          mockSectionsData.license as any,
          errorsList.license || []
        ),
        d: new UpdateSectionDataAction(
          submissionId,
          'upload',
          mockSectionsData.upload as any,
          errorsList.upload || []
        ),
      });

      expect(submissionObjectEffects.saveSubmissionSuccess$).toBeObservable(expected);
      expect(notificationsServiceStub.success).toHaveBeenCalled();

    });

    it('should display a success notification', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      const response = [Object.assign({}, mockSubmissionRestResponse[0], {
        sections: mockSectionsData
      })];
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS,
          payload: {
            submissionId: submissionId,
            submissionObject: response
          }
        }
      });

      const expected = cold('--(bcd)-', {
        b: new UpdateSectionDataAction(
          submissionId,
          'traditionalpageone',
          mockSectionsData.traditionalpageone as any,
          []
        ),
        c: new UpdateSectionDataAction(
          submissionId,
          'license',
          mockSectionsData.license as any,
          []
        ),
        d: new UpdateSectionDataAction(
          submissionId,
          'upload',
          mockSectionsData.upload as any,
          []
        ),
      });

      expect(submissionObjectEffects.saveSubmissionSuccess$).toBeObservable(expected);
      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });

    it('should display a warning notification when there are errors', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      const response = [Object.assign({}, mockSubmissionRestResponse[0], {
        sections: mockSectionsData,
        errors: mockSectionsErrors
      })];
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS,
          payload: {
            submissionId: submissionId,
            submissionObject: response
          }
        }
      });

      const errorsList = parseSectionErrors(mockSectionsErrors);
      const expected = cold('--(bcd)-', {
        b: new UpdateSectionDataAction(
          submissionId,
          'traditionalpageone',
          mockSectionsData.traditionalpageone as any,
          errorsList.traditionalpageone || []
        ),
        c: new UpdateSectionDataAction(
          submissionId,
          'license',
          mockSectionsData.license as any,
          errorsList.license || []
        ),
        d: new UpdateSectionDataAction(
          submissionId,
          'upload',
          mockSectionsData.upload as any,
          errorsList.upload || []
        ),
      });

      expect(submissionObjectEffects.saveSubmissionSuccess$).toBeObservable(expected);
      expect(notificationsServiceStub.warning).toHaveBeenCalled();
    });

    it('should detect and notify a new section', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      const response = [Object.assign({}, mockSubmissionRestResponse[0], {
        sections: mockSectionsDataTwo,
        errors: mockSectionsErrors
      })];
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS,
          payload: {
            submissionId: submissionId,
            submissionObject: response
          }
        }
      });

      const errorsList = parseSectionErrors(mockSectionsErrors);
      const expected = cold('--(bcde)-', {
        b: new UpdateSectionDataAction(
          submissionId,
          'traditionalpageone',
          mockSectionsDataTwo.traditionalpageone as any,
          errorsList.traditionalpageone || []
        ),
        c: new UpdateSectionDataAction(
          submissionId,
          'traditionalpagetwo',
          mockSectionsDataTwo.traditionalpagetwo as any,
          errorsList.traditionalpagetwo || []
        ),
        d: new UpdateSectionDataAction(
          submissionId,
          'license',
          mockSectionsDataTwo.license as any,
          errorsList.license || []
        ),
        e: new UpdateSectionDataAction(
          submissionId,
          'upload',
          mockSectionsDataTwo.upload as any,
          errorsList.upload || []
        ),
      });

      expect(submissionObjectEffects.saveSubmissionSuccess$).toBeObservable(expected);
      expect(submissionServiceStub.notifyNewSection).toHaveBeenCalled();
    });

  });

  describe('saveSection$', () => {
    it('should return a SAVE_SUBMISSION_SECTION_FORM_SUCCESS action on success', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM,
          payload: {
            submissionId: submissionId,
            sectionId: 'traditionalpageone'
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceID.and.returnValue(observableOf(mockSubmissionRestResponse));
      const expected = cold('--b-', {
        b: new SaveSubmissionSectionFormSuccessAction(
          submissionId,
          mockSubmissionRestResponse as any
        )
      });

      expect(submissionObjectEffects.saveSection$).toBeObservable(expected);
    });

    it('should return a SAVE_SUBMISSION_SECTION_FORM_ERROR action on error', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM,
          payload: {
            submissionId: submissionId,
            sectionId: 'traditionalpageone'
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceID.and.callFake(
        () => observableThrowError('Error')
      );
      const expected = cold('--b-', {
        b: new SaveSubmissionSectionFormErrorAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.saveSection$).toBeObservable(expected);
    });
  });

  describe('saveAndDepositSection$', () => {
    it('should return a DEPOSIT_SUBMISSION action on success', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      const response = [Object.assign({}, mockSubmissionRestResponse[0], {
        sections: mockSectionsDataTwo
      })];

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.returnValue(observableOf(response));
      const expected = cold('--b-', {
        b: new DepositSubmissionAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.saveAndDeposit$).toBeObservable(expected);
    });

    it('should not allow to deposit when there are errors', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      const response = [Object.assign({}, mockSubmissionRestResponse[0], {
        sections: mockSectionsData,
        errors: mockSectionsErrors
      })];

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.returnValue(observableOf(response));

      const errorsList = parseSectionErrors(mockSectionsErrors);
      const expected = cold('--b-', {
        b: [
          new UpdateSectionDataAction(
            submissionId,
            'traditionalpageone',
            mockSectionsData.traditionalpageone as any,
            errorsList.traditionalpageone || []
          ),
          new UpdateSectionDataAction(
            submissionId,
            'license',
            mockSectionsData.license as any,
            errorsList.license || []
          ),
          new UpdateSectionDataAction(
            submissionId,
            'upload',
            mockSectionsData.upload as any,
            errorsList.upload || []
          )
        ]
      });

      expect(submissionObjectEffects.saveAndDeposit$).toBeObservable(expected);
    });

    it('should catch errors and return a SAVE_SUBMISSION_FORM_ERROR', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionJsonPatchOperationsServiceStub.jsonPatchByResourceType.and.callFake(
        () => observableThrowError('Error')
      );
      const expected = cold('--b-', {
        b: new SaveSubmissionFormErrorAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.saveAndDeposit$).toBeObservable(expected);
    });
  });

  describe('depositSubmission$', () => {
    it('should return a DEPOSIT_SUBMISSION_SUCCESS action on success', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DEPOSIT_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionServiceStub.depositSubmission.and.returnValue(observableOf(mockSubmissionRestResponse));
      const expected = cold('--b-', {
        b: new DepositSubmissionSuccessAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.depositSubmission$).toBeObservable(expected);
    });

    it('should return a DEPOSIT_SUBMISSION_ERROR action on error', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DEPOSIT_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionServiceStub.depositSubmission.and.callFake(
        () => observableThrowError('Error')
      );
      const expected = cold('--b-', {
        b: new DepositSubmissionErrorAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.depositSubmission$).toBeObservable(expected);
    });
  });

  describe('saveForLaterSubmissionSuccess$', () => {
    it('should display a new success notification and redirect to mydspace', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS,
          payload: {
            submissionId: submissionId,
            submissionObject: mockSubmissionRestResponse
          }
        }
      });

      submissionObjectEffects.saveForLaterSubmissionSuccess$.subscribe(() => {
        expect(notificationsServiceStub.success).toHaveBeenCalled();
        expect(submissionServiceStub.redirectToMyDSpace).toHaveBeenCalled();
      });
    });
  });

  describe('depositSubmissionSuccess$', () => {
    it('should display a new success notification and redirect to mydspace', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionObjectEffects.depositSubmissionSuccess$.subscribe(() => {
        expect(notificationsServiceStub.success).toHaveBeenCalled();
        expect(submissionServiceStub.redirectToMyDSpace).toHaveBeenCalled();
      });
    });
  });

  describe('depositSubmissionError$', () => {
    it('should display a new error notification', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionObjectEffects.depositSubmissionError$.subscribe(() => {
        expect(notificationsServiceStub.error).toHaveBeenCalled();
      });
    });
  });

  describe('saveError$', () => {
    it('should display a new error notification', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionObjectEffects.saveError$.subscribe(() => {
        expect(notificationsServiceStub.error).toHaveBeenCalled();
      });
    });

    it('should display a new error notification', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionObjectEffects.saveError$.subscribe(() => {
        expect(notificationsServiceStub.error).toHaveBeenCalled();
      });
    });
  });

  describe('discardSubmission$', () => {
    it('should return a DISCARD_SUBMISSION_SUCCESS action on success', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DISCARD_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionServiceStub.discardSubmission.and.returnValue(observableOf(mockSubmissionRestResponse));
      const expected = cold('--b-', {
        b: new DiscardSubmissionSuccessAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.discardSubmission$).toBeObservable(expected);
    });

    it('should return a DISCARD_SUBMISSION_ERROR action on error', () => {
      store.nextState({
        submission: {
          objects: submissionState
        }
      } as any);

      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DISCARD_SUBMISSION,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionServiceStub.discardSubmission.and.callFake(
        () => observableThrowError('Error')
      );
      const expected = cold('--b-', {
        b: new DiscardSubmissionErrorAction(
          submissionId
        )
      });

      expect(submissionObjectEffects.discardSubmission$).toBeObservable(expected);
    });
  });

  describe('discardSubmissionSuccess$', () => {
    it('should display a new success notification and redirect to mydspace', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionObjectEffects.discardSubmissionSuccess$.subscribe(() => {
        expect(notificationsServiceStub.success).toHaveBeenCalled();
        expect(submissionServiceStub.redirectToMyDSpace).toHaveBeenCalled();
      });
    });
  });

  describe('discardSubmissionError$', () => {
    it('should display a new error notification', () => {
      actions = hot('--a-', {
        a: {
          type: SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR,
          payload: {
            submissionId: submissionId
          }
        }
      });

      submissionObjectEffects.discardSubmissionError$.subscribe(() => {
        expect(notificationsServiceStub.error).toHaveBeenCalled();
      });
    });
  });
});
