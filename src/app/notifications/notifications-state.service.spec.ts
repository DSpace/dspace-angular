import { TestBed } from '@angular/core/testing';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import {
  qualityAssuranceSourceObjectMissingPid,
  qualityAssuranceSourceObjectMoreAbstract,
  qualityAssuranceSourceObjectMorePid,
  qualityAssuranceTopicObjectMissingPid,
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid,
} from '../shared/mocks/notifications.mock';
import { suggestionNotificationsReducers } from './notifications.reducer';
import { NotificationsStateService } from './notifications-state.service';
import { RetrieveAllSourceAction } from './qa/source/quality-assurance-source.actions';
import { RetrieveAllTopicsAction } from './qa/topics/quality-assurance-topics.actions';

describe('NotificationsStateService', () => {
  let service: NotificationsStateService;
  let serviceAsAny: any;
  let store: any;
  let initialState: any;

  describe('Topis State', () => {
    function init(mode: string) {
      if (mode === 'empty') {
        initialState = {
          suggestionNotifications: {
            qaTopic: {
              topics: [],
              processing: false,
              loaded: false,
              totalPages: 0,
              currentPage: 0,
              totalElements: 0,
              totalLoadedPages: 0,
            },
          },
        };
      } else {
        initialState = {
          suggestionNotifications: {
            qaTopic: {
              topics: [
                qualityAssuranceTopicObjectMorePid,
                qualityAssuranceTopicObjectMoreAbstract,
                qualityAssuranceTopicObjectMissingPid,
              ],
              processing: false,
              loaded: true,
              totalPages: 1,
              currentPage: 1,
              totalElements: 3,
              totalLoadedPages: 1,
            },
          },
        };
      }
    }

    describe('Testing methods with empty topic objects', () => {
      beforeEach(async () => {
        init('empty');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ suggestionNotifications: suggestionNotificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service },
          ],
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getQualityAssuranceTopics', () => {
        it('Should return an empty array', () => {
          const result = service.getQualityAssuranceTopics();
          const expected = cold('(a)', {
            a: [],
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceTopicsTotalPages', () => {
        it('Should return zero (0)', () => {
          const result = service.getQualityAssuranceTopicsTotalPages();
          const expected = cold('(a)', {
            a: 0,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceTopicsCurrentPage', () => {
        it('Should return minus one (0)', () => {
          const result = service.getQualityAssuranceTopicsCurrentPage();
          const expected = cold('(a)', {
            a: 0,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceTopicsTotals', () => {
        it('Should return zero (0)', () => {
          const result = service.getQualityAssuranceTopicsTotals();
          const expected = cold('(a)', {
            a: 0,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceTopicsLoading', () => {
        it('Should return TRUE', () => {
          const result = service.isQualityAssuranceTopicsLoading();
          const expected = cold('(a)', {
            a: true,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceTopicsLoaded', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceTopicsLoaded();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceTopicsProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceTopicsProcessing();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });
    });

    describe('Testing methods with topic objects', () => {
      beforeEach(async () => {
        init('full');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ suggestionNotifications: suggestionNotificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service },
          ],
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getQualityAssuranceTopics', () => {
        it('Should return an array of topics', () => {
          const result = service.getQualityAssuranceTopics();
          const expected = cold('(a)', {
            a: [
              qualityAssuranceTopicObjectMorePid,
              qualityAssuranceTopicObjectMoreAbstract,
              qualityAssuranceTopicObjectMissingPid,
            ],
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceTopicsTotalPages', () => {
        it('Should return one (1)', () => {
          const result = service.getQualityAssuranceTopicsTotalPages();
          const expected = cold('(a)', {
            a: 1,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceTopicsCurrentPage', () => {
        it('Should return minus zero (1)', () => {
          const result = service.getQualityAssuranceTopicsCurrentPage();
          const expected = cold('(a)', {
            a: 1,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceTopicsTotals', () => {
        it('Should return three (3)', () => {
          const result = service.getQualityAssuranceTopicsTotals();
          const expected = cold('(a)', {
            a: 3,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceTopicsLoading', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceTopicsLoading();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceTopicsLoaded', () => {
        it('Should return TRUE', () => {
          const result = service.isQualityAssuranceTopicsLoaded();
          const expected = cold('(a)', {
            a: true,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceTopicsProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceTopicsProcessing();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });
    });

    describe('Testing the topic dispatch methods', () => {
      beforeEach(async () => {
        init('full');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ suggestionNotifications: suggestionNotificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service },
          ],
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('dispatchRetrieveQualityAssuranceTopics', () => {
        it('Should call store.dispatch', () => {
          const elementsPerPage = 3;
          const currentPage = 1;
          const action = new RetrieveAllTopicsAction(elementsPerPage, currentPage, 'source', 'target');
          service.dispatchRetrieveQualityAssuranceTopics(elementsPerPage, currentPage, 'source', 'target');
          expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
        });
      });
    });
  });

  describe('Source State', () => {
    function init(mode: string) {
      if (mode === 'empty') {
        initialState = {
          suggestionNotifications: {
            qaSource: {
              source: [],
              processing: false,
              loaded: false,
              totalPages: 0,
              currentPage: 0,
              totalElements: 0,
              totalLoadedPages: 0,
            },
          },
        };
      } else {
        initialState = {
          suggestionNotifications: {
            qaSource: {
              source: [
                qualityAssuranceSourceObjectMorePid,
                qualityAssuranceSourceObjectMoreAbstract,
                qualityAssuranceSourceObjectMissingPid,
              ],
              processing: false,
              loaded: true,
              totalPages: 1,
              currentPage: 1,
              totalElements: 3,
              totalLoadedPages: 1,
            },
          },
        };
      }
    }

    describe('Testing methods with empty source objects', () => {
      beforeEach(async () => {
        init('empty');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ suggestionNotifications: suggestionNotificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service },
          ],
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getQualityAssuranceSource', () => {
        it('Should return an empty array', () => {
          const result = service.getQualityAssuranceSource();
          const expected = cold('(a)', {
            a: [],
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceSourceTotalPages', () => {
        it('Should return zero (0)', () => {
          const result = service.getQualityAssuranceSourceTotalPages();
          const expected = cold('(a)', {
            a: 0,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceSourcesCurrentPage', () => {
        it('Should return minus one (0)', () => {
          const result = service.getQualityAssuranceSourceCurrentPage();
          const expected = cold('(a)', {
            a: 0,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceSourceTotals', () => {
        it('Should return zero (0)', () => {
          const result = service.getQualityAssuranceSourceTotals();
          const expected = cold('(a)', {
            a: 0,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceSourceLoading', () => {
        it('Should return TRUE', () => {
          const result = service.isQualityAssuranceSourceLoading();
          const expected = cold('(a)', {
            a: true,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceSourceLoaded', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceSourceLoaded();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceSourceProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceSourceProcessing();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });
    });

    describe('Testing methods with Source objects', () => {
      beforeEach(async () => {
        init('full');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ suggestionNotifications: suggestionNotificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service },
          ],
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getQualityAssuranceSource', () => {
        it('Should return an array of Source', () => {
          const result = service.getQualityAssuranceSource();
          const expected = cold('(a)', {
            a: [
              qualityAssuranceSourceObjectMorePid,
              qualityAssuranceSourceObjectMoreAbstract,
              qualityAssuranceSourceObjectMissingPid,
            ],
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceSourceTotalPages', () => {
        it('Should return one (1)', () => {
          const result = service.getQualityAssuranceSourceTotalPages();
          const expected = cold('(a)', {
            a: 1,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceSourceCurrentPage', () => {
        it('Should return minus zero (1)', () => {
          const result = service.getQualityAssuranceSourceCurrentPage();
          const expected = cold('(a)', {
            a: 1,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getQualityAssuranceSourceTotals', () => {
        it('Should return three (3)', () => {
          const result = service.getQualityAssuranceSourceTotals();
          const expected = cold('(a)', {
            a: 3,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceSourceLoading', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceSourceLoading();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceSourceLoaded', () => {
        it('Should return TRUE', () => {
          const result = service.isQualityAssuranceSourceLoaded();
          const expected = cold('(a)', {
            a: true,
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isQualityAssuranceSourceProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isQualityAssuranceSourceProcessing();
          const expected = cold('(a)', {
            a: false,
          });
          expect(result).toBeObservable(expected);
        });
      });
    });

    describe('Testing the Source dispatch methods', () => {
      beforeEach(async () => {
        init('full');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ suggestionNotifications: suggestionNotificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service },
          ],
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('dispatchRetrieveQualityAssuranceSource', () => {
        it('Should call store.dispatch', () => {
          const elementsPerPage = 3;
          const currentPage = 1;
          const action = new RetrieveAllSourceAction(elementsPerPage, currentPage);
          service.dispatchRetrieveQualityAssuranceSource(elementsPerPage, currentPage);
          expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
        });
      });
    });
  });


});
