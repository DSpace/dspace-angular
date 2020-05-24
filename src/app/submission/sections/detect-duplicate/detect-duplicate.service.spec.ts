import * as ngrx from '@ngrx/store';
import { Store, StoreModule } from '@ngrx/store';
import { async, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { DetectDuplicateService } from './detect-duplicate.service';
import { submissionReducers } from '../../submission.reducers';
import {
  mockDeduplicationMatches,
  mockDeduplicationSubmitterId,
  mockDeduplicationWorkflowId,
  mockSubmissionId,
  mockSubmissionState
} from '../../../shared/mocks/submission.mock';
import { SetDuplicateDecisionAction } from '../../objects/submission-objects.actions';

describe('DetectDuplicateService', () => {
  let service: DetectDuplicateService;
  let serviceAsAny: any;
  let selectSpy: any;
  let store: any;
  let initialState: any;
  const sectionId = 'detect-duplicate';

  function init() {
    initialState = { submission: { objects: mockSubmissionState } };
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ submission: submissionReducers } as any),
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: DetectDuplicateService, useValue: service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    service = new DetectDuplicateService(store);
    serviceAsAny = service;
    selectSpy = spyOnProperty(ngrx, 'select').and.callThrough();
    spyOn(store, 'dispatch');
  });

  describe('Testing methods with empty deduplication matches', () => {

    describe('getDuplicateMatches', () => {
      it('Should return an empty object', () => {
        const result = service.getDuplicateMatches(mockSubmissionId, sectionId);
        const expected = cold('(ab)', {
          a: { matches: {} },
          b: { matches: {} },
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getDuplicateMatchesByScope', () => {
      it('Should return an empty object using isWorkFlow as true', () => {
        const result = service.getDuplicateMatchesByScope(mockSubmissionId, sectionId, true);
        const expected = cold('(ab)', {
          a: { matches: {} },
          b: { matches: {} },
        });
        expect(result).toBeObservable(expected);
      });
      it('Should return an empty object using isWorkFlow as false', () => {
        const result = service.getDuplicateMatchesByScope(mockSubmissionId, sectionId, false);
        const expected = cold('(ab)', {
          a: { matches: {} },
          b: { matches: {} },
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getDuplicateTotalMatches', () => {
      it('Should return zero (0)', () => {
        const result = service.getDuplicateTotalMatches(mockSubmissionId, sectionId);
        const expected = cold('(a)', {
          a: 0,
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('saveDuplicateDecision', () => {
      it('Should call store.dispatch', () => {
        const action = new SetDuplicateDecisionAction(mockSubmissionId, sectionId);
        service.saveDuplicateDecision(mockSubmissionId, sectionId);

        expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });

  describe('Testing methods with deduplication matches', () => {
    beforeEach(() => {
      selectSpy.and.callFake(() => {
        return () => {
          return () => hot('a', {
              a: { matches: mockDeduplicationMatches }
            }
          );
        };
      });
    });

    describe('getDuplicateMatches', () => {
      it('Should return an object with items', () => {
        const result = service.getDuplicateMatches(mockSubmissionId, sectionId);
        const expected = cold('(ab)', {
          a: { matches: {} },
          b: { matches: mockDeduplicationMatches },
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getDuplicateMatchesByScope', () => {
      it('Should return an object with workflow items only, using isWorkFlow as true', () => {
        const result = service.getDuplicateMatchesByScope(mockSubmissionId, sectionId, true);
        const mockDeduplicationWorkflowMatches = Object.assign({}, mockDeduplicationMatches);
        delete mockDeduplicationWorkflowMatches[mockDeduplicationWorkflowId];
        const expected = cold('(ab)', {
          a: { matches: {} },
          b: { matches: mockDeduplicationWorkflowMatches },
        });
        expect(result).toBeObservable(expected);
      });
      it('Should return an object with submitter items only, using isWorkFlow as false', () => {
        const result = service.getDuplicateMatchesByScope(mockSubmissionId, sectionId, false);
        const mockDeduplicationSubmitterMatches = Object.assign({}, mockDeduplicationMatches);
        delete mockDeduplicationSubmitterMatches[mockDeduplicationSubmitterId];
        const expected = cold('(ab)', {
          a: { matches: {} },
          b: { matches: mockDeduplicationSubmitterMatches },
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getDuplicateTotalMatches', () => {
      it('Should return the number of the items', () => {
        const result = service.getDuplicateTotalMatches(mockSubmissionId, sectionId);
        const expected = cold('(ab)', {
          a: 0,
          b: Object.keys(mockDeduplicationMatches).length
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('saveDuplicateDecision', () => {
      it('Should call store.dispatch', () => {
        const action = new SetDuplicateDecisionAction(mockSubmissionId, sectionId);
        service.saveDuplicateDecision(mockSubmissionId, sectionId);

        expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });

});
