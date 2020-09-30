import { async, TestBed } from '@angular/core/testing';

import { cold, getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { submissionReducers } from '../submission.reducers';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionService } from '../submission.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { SubmissionServiceStub } from '../../shared/testing/submission-service.stub';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { SectionsService } from './sections.service';
import {
  mockSectionsData,
  mockSectionsErrors,
  mockSubmissionState
} from '../../shared/mocks/submission.mock';
import {
  DisableSectionAction,
  EnableSectionAction,
  InertSectionErrorsAction,
  RemoveSectionErrorsAction,
  SectionStatusChangeAction,
  UpdateSectionDataAction
} from '../objects/submission-objects.actions';
import {
  FormAddError,
  FormClearErrorsAction,
  FormRemoveErrorAction
} from '../../shared/form/form.actions';
import parseSectionErrors from '../utils/parseSectionErrors';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { SubmissionSectionError } from '../objects/submission-objects.reducer';
import { getMockScrollToService } from '../../shared/mocks/scroll-to-service.mock';
import { storeModuleConfig } from '../../app.reducer';
import { SectionsType } from './sections-type';

describe('SectionsService test suite', () => {
  let notificationsServiceStub: NotificationsServiceStub;
  let scrollToService: ScrollToService;
  let service: SectionsService;
  let submissionServiceStub: SubmissionServiceStub;
  let translateService: any;

  const formId = 'formTest';
  const submissionId = '826';
  const sectionId = 'traditionalpageone';
  const sectionErrors: any = parseSectionErrors(mockSectionsErrors);
  const sectionData: any = mockSectionsData;
  const submissionState: any = Object.assign({}, mockSubmissionState[submissionId]);
  const sectionState: any = Object.assign({}, mockSubmissionState['826'].sections[sectionId]);

  const store: any = jasmine.createSpyObj('store', {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ submissionReducers } as any, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: ScrollToService, useValue: getMockScrollToService() },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: Store, useValue: store },
        SectionsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(SectionsService);
    submissionServiceStub = TestBed.get(SubmissionService);
    notificationsServiceStub = TestBed.get(NotificationsService);
    scrollToService = TestBed.get(ScrollToService);
    translateService = TestBed.get(TranslateService);
  });

  describe('checkSectionErrors', () => {
    it('should dispatch a new RemoveSectionErrorsAction and FormClearErrorsAction when there are no errors', () => {
      service.checkSectionErrors(submissionId, sectionId, formId, []);

      expect(store.dispatch).toHaveBeenCalledWith(new RemoveSectionErrorsAction(submissionId, sectionId));
      expect(store.dispatch).toHaveBeenCalledWith(new FormClearErrorsAction(formId));
    });

    it('should dispatch a new FormAddError for each section\'s error', () => {
      service.checkSectionErrors(submissionId, sectionId, formId, sectionErrors[sectionId]);

      expect(store.dispatch).toHaveBeenCalledWith(new FormAddError(
        formId,
        'dc_contributor_author',
        0,
        'error.validation.required'));

      expect(store.dispatch).toHaveBeenCalledWith(new FormAddError(
        formId,
        'dc_title',
        0,
        'error.validation.required'));

      expect(store.dispatch).toHaveBeenCalledWith(new FormAddError(formId,
        'dc_date_issued',
        0,
        'error.validation.required'));
    });

    it('should dispatch a new FormRemoveErrorAction for each section\'s error that no longer exists', () => {
      const currentErrors = Array.of(...sectionErrors[sectionId]);
      const prevErrors = Array.of(...sectionErrors[sectionId]);
      currentErrors.pop();

      service.checkSectionErrors(submissionId, sectionId, formId, currentErrors, prevErrors);

      expect(store.dispatch).toHaveBeenCalledWith(new FormAddError(
        formId,
        'dc_contributor_author',
        0,
        'error.validation.required'));

      expect(store.dispatch).toHaveBeenCalledWith(new FormAddError(
        formId,
        'dc_title',
        0,
        'error.validation.required'));
      expect(store.dispatch).toHaveBeenCalledWith(new FormRemoveErrorAction(
        formId,
        'dc_date_issued',
        0));
    });
  });

  describe('dispatchRemoveSectionErrors', () => {
    it('should dispatch a new RemoveSectionErrorsAction', () => {
      service.dispatchRemoveSectionErrors(submissionId, sectionId);
      const expected = new RemoveSectionErrorsAction(submissionId, sectionId);

      expect(store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('getSectionData', () => {
    it('should return an observable with section\'s data', () => {
      store.select.and.returnValue(observableOf(sectionData[sectionId]));

      const expected = cold('(b|)', {
        b: sectionData[sectionId]
      });

      expect(service.getSectionData(submissionId, sectionId, SectionsType.SubmissionForm)).toBeObservable(expected);
    });
  });

  describe('getSectionErrors', () => {
    it('should return an observable with section\'s errors', () => {
      store.select.and.returnValue(observableOf(sectionErrors[sectionId]));

      const expected = cold('(b|)', {
        b: sectionErrors[sectionId]
      });

      expect(service.getSectionErrors(submissionId, sectionId)).toBeObservable(expected);
    });
  });

  describe('getSectionState', () => {
    it('should return an observable with section\'s state', () => {
      store.select.and.returnValue(observableOf(sectionState));

      const expected = cold('(b|)', {
        b: sectionState
      });

      expect(service.getSectionState(submissionId, sectionId, SectionsType.SubmissionForm)).toBeObservable(expected);
    });
  });

  describe('isSectionValid', () => {
    it('should return an observable of boolean', () => {
      store.select.and.returnValue(observableOf({ isValid: false }));

      let expected = cold('(b|)', {
        b: false
      });

      expect(service.isSectionValid(submissionId, sectionId)).toBeObservable(expected);

      store.select.and.returnValue(observableOf({ isValid: true }));

      expected = cold('(b|)', {
        b: true
      });

      expect(service.isSectionValid(submissionId, sectionId)).toBeObservable(expected);
    });
  });

  describe('isSectionActive', () => {
    it('should return an observable of boolean', () => {
      submissionServiceStub.getActiveSectionId.and.returnValue(observableOf(sectionId));

      let expected = cold('(b|)', {
        b: true
      });

      expect(service.isSectionActive(submissionId, sectionId)).toBeObservable(expected);

      submissionServiceStub.getActiveSectionId.and.returnValue(observableOf('test'));

      expected = cold('(b|)', {
        b: false
      });

      expect(service.isSectionActive(submissionId, sectionId)).toBeObservable(expected);
    });
  });

  describe('isSectionEnabled', () => {
    it('should return an observable of boolean', () => {
      store.select.and.returnValue(observableOf({ enabled: false }));

      let expected = cold('(b|)', {
        b: false
      });

      expect(service.isSectionEnabled(submissionId, sectionId)).toBeObservable(expected);

      store.select.and.returnValue(observableOf({ enabled: true }));

      expected = cold('(b|)', {
        b: true
      });

      expect(service.isSectionEnabled(submissionId, sectionId)).toBeObservable(expected);
    });
  });

  describe('isSectionReadOnly', () => {
    it('should return an observable of true when it\'s a readonly section and scope is not workspace', () => {
      store.select.and.returnValue(observableOf({
        visibility: {
          main: null,
          other: 'READONLY'
        }
      }));

      const expected = cold('(b|)', {
        b: true
      });

      expect(service.isSectionReadOnly(submissionId, sectionId, SubmissionScopeType.WorkflowItem)).toBeObservable(expected);
    });

    it('should return an observable of false when it\'s a readonly section and scope is workspace', () => {
      store.select.and.returnValue(observableOf({
        visibility: {
          main: null,
          other: 'READONLY'
        }
      }));

      const expected = cold('(b|)', {
        b: false
      });

      expect(service.isSectionReadOnly(submissionId, sectionId, SubmissionScopeType.WorkspaceItem)).toBeObservable(expected);
    });

    it('should return an observable of false when it\'s not a readonly section', () => {
      store.select.and.returnValue(observableOf({
        visibility: null
      }));

      const expected = cold('(b|)', {
        b: false
      });

      expect(service.isSectionReadOnly(submissionId, sectionId, SubmissionScopeType.WorkflowItem)).toBeObservable(expected);
    });
  });

  describe('isSectionAvailable', () => {
    it('should return an observable of true when section is available', () => {
      store.select.and.returnValue(observableOf(submissionState));

      const expected = cold('(b|)', {
        b: true
      });

      expect(service.isSectionAvailable(submissionId, sectionId)).toBeObservable(expected);
    });

    it('should return an observable of false when section is not available', () => {
      store.select.and.returnValue(observableOf(submissionState));

      const expected = cold('(b|)', {
        b: false
      });

      expect(service.isSectionAvailable(submissionId, 'test')).toBeObservable(expected);
    });
  });

  describe('addSection', () => {
    it('should dispatch a new EnableSectionAction a move target to new section', () => {

      service.addSection(submissionId, 'newSection');

      expect(store.dispatch).toHaveBeenCalledWith(new EnableSectionAction(submissionId, 'newSection'));
      expect(scrollToService.scrollTo).toHaveBeenCalled();
    });
  });

  describe('removeSection', () => {
    it('should dispatch a new DisableSectionAction', () => {

      service.removeSection(submissionId, 'newSection');

      expect(store.dispatch).toHaveBeenCalledWith(new DisableSectionAction(submissionId, 'newSection'));
    });
  });

  describe('setSectionError', () => {
    it('should dispatch a new InertSectionErrorsAction', () => {

      const error: SubmissionSectionError = {
        path: 'test',
        message: 'message test'
      };
      service.setSectionError(submissionId, sectionId, error);

      expect(store.dispatch).toHaveBeenCalledWith(new InertSectionErrorsAction(submissionId, sectionId, error));
    });
  });

  describe('setSectionStatus', () => {
    it('should dispatch a new SectionStatusChangeAction', () => {

      service.setSectionStatus(submissionId, sectionId, true);

      expect(store.dispatch).toHaveBeenCalledWith(new SectionStatusChangeAction(submissionId, sectionId, true));
    });
  });

  describe('updateSectionData', () => {

    it('should dispatch a new UpdateSectionDataAction', () => {
      const scheduler = getTestScheduler();
      const data: any = { test: 'test' };
      spyOn(service, 'isSectionAvailable').and.returnValue(observableOf(true));
      spyOn(service, 'isSectionEnabled').and.returnValue(observableOf(true));
      scheduler.schedule(() => service.updateSectionData(submissionId, sectionId, data, []));
      scheduler.flush();

      expect(store.dispatch).toHaveBeenCalledWith(new UpdateSectionDataAction(submissionId, sectionId, data, []));
    });

    it('should dispatch a new UpdateSectionDataAction and display a new notification when section is not enabled', () => {
      const scheduler = getTestScheduler();
      const data: any = { test: 'test' };
      spyOn(service, 'isSectionAvailable').and.returnValue(observableOf(true));
      spyOn(service, 'isSectionEnabled').and.returnValue(observableOf(false));
      translateService.get.and.returnValue(observableOf('test'));
      scheduler.schedule(() => service.updateSectionData(submissionId, sectionId, data, []));
      scheduler.flush();

      expect(store.dispatch).toHaveBeenCalledWith(new UpdateSectionDataAction(submissionId, sectionId, data, []));
    });
  });
});
