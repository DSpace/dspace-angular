import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { openaireReducers } from './openaire.reducer';
import { OpenaireStateService } from './openaire-state.service';
import {
  openaireBrokerTopicObjectMissingPid,
  openaireBrokerTopicObjectMoreAbstract,
  openaireBrokerTopicObjectMorePid
} from '../shared/mocks/openaire.mock';
import { RetrieveAllTopicsAction } from './broker/topics/openaire-broker-topics.actions';

describe('OpenaireStateService', () => {
  let service: OpenaireStateService;
  let serviceAsAny: any;
  let store: any;
  let initialState: any;

  function init(mode: string) {
    if (mode === 'empty') {
      initialState = {
        openaire: {
          brokerTopic: {
            topics: [],
            processing: false,
            loaded: false,
            totalPages: 0,
            currentPage: 0,
            totalElements: 0,
            totalLoadedPages: 0
          }
        }
      };
    } else {
      initialState = {
        openaire: {
          brokerTopic: {
            topics: [
              openaireBrokerTopicObjectMorePid,
              openaireBrokerTopicObjectMoreAbstract,
              openaireBrokerTopicObjectMissingPid
            ],
            processing: false,
            loaded: true,
            totalPages: 1,
            currentPage: 1,
            totalElements: 3,
            totalLoadedPages: 1
          }
        }
      };
    }
  }

  describe('Testing methods with empty topic objects', () => {
    beforeEach(async () => {
      init('empty');
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({ openaire: openaireReducers } as any),
        ],
        providers: [
          provideMockStore({ initialState }),
          { provide: OpenaireStateService, useValue: service }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      store = TestBed.get(Store);
      service = new OpenaireStateService(store);
      serviceAsAny = service;
      spyOn(store, 'dispatch');
    });

    describe('getOpenaireBrokerTopics', () => {
      it('Should return an empty array', () => {
        const result = service.getOpenaireBrokerTopics();
        const expected = cold('(a)', {
          a: []
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getOpenaireBrokerTopicsTotalPages', () => {
      it('Should return zero (0)', () => {
        const result = service.getOpenaireBrokerTopicsTotalPages();
        const expected = cold('(a)', {
          a: 0
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getOpenaireBrokerTopicsCurrentPage', () => {
      it('Should return minus one (0)', () => {
        const result = service.getOpenaireBrokerTopicsCurrentPage();
        const expected = cold('(a)', {
          a: 0
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getOpenaireBrokerTopicsTotals', () => {
      it('Should return zero (0)', () => {
        const result = service.getOpenaireBrokerTopicsTotals();
        const expected = cold('(a)', {
          a: 0
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('isOpenaireBrokerTopicsLoading', () => {
      it('Should return TRUE', () => {
        const result = service.isOpenaireBrokerTopicsLoading();
        const expected = cold('(a)', {
          a: true
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('isOpenaireBrokerTopicsLoaded', () => {
      it('Should return FALSE', () => {
        const result = service.isOpenaireBrokerTopicsLoaded();
        const expected = cold('(a)', {
          a: false
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('isOpenaireBrokerTopicsProcessing', () => {
      it('Should return FALSE', () => {
        const result = service.isOpenaireBrokerTopicsProcessing();
        const expected = cold('(a)', {
          a: false
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
          StoreModule.forRoot({ openaire: openaireReducers } as any),
        ],
        providers: [
          provideMockStore({ initialState }),
          { provide: OpenaireStateService, useValue: service }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      store = TestBed.get(Store);
      service = new OpenaireStateService(store);
      serviceAsAny = service;
      spyOn(store, 'dispatch');
    });

    describe('getOpenaireBrokerTopics', () => {
      it('Should return an array of topics', () => {
        const result = service.getOpenaireBrokerTopics();
        const expected = cold('(a)', {
          a: [
            openaireBrokerTopicObjectMorePid,
            openaireBrokerTopicObjectMoreAbstract,
            openaireBrokerTopicObjectMissingPid
          ]
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getOpenaireBrokerTopicsTotalPages', () => {
      it('Should return one (1)', () => {
        const result = service.getOpenaireBrokerTopicsTotalPages();
        const expected = cold('(a)', {
          a: 1
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getOpenaireBrokerTopicsCurrentPage', () => {
      it('Should return minus zero (1)', () => {
        const result = service.getOpenaireBrokerTopicsCurrentPage();
        const expected = cold('(a)', {
          a: 1
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('getOpenaireBrokerTopicsTotals', () => {
      it('Should return three (3)', () => {
        const result = service.getOpenaireBrokerTopicsTotals();
        const expected = cold('(a)', {
          a: 3
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('isOpenaireBrokerTopicsLoading', () => {
      it('Should return FALSE', () => {
        const result = service.isOpenaireBrokerTopicsLoading();
        const expected = cold('(a)', {
          a: false
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('isOpenaireBrokerTopicsLoaded', () => {
      it('Should return TRUE', () => {
        const result = service.isOpenaireBrokerTopicsLoaded();
        const expected = cold('(a)', {
          a: true
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('isOpenaireBrokerTopicsProcessing', () => {
      it('Should return FALSE', () => {
        const result = service.isOpenaireBrokerTopicsProcessing();
        const expected = cold('(a)', {
          a: false
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
          StoreModule.forRoot({ openaire: openaireReducers } as any),
        ],
        providers: [
          provideMockStore({ initialState }),
          { provide: OpenaireStateService, useValue: service }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      store = TestBed.get(Store);
      service = new OpenaireStateService(store);
      serviceAsAny = service;
      spyOn(store, 'dispatch');
    });

    describe('dispatchRetrieveOpenaireBrokerTopics', () => {
      it('Should call store.dispatch', () => {
        const elementsPerPage = 3;
        const currentPage = 1;
        const action = new RetrieveAllTopicsAction(elementsPerPage, currentPage);
        service.dispatchRetrieveOpenaireBrokerTopics(elementsPerPage, currentPage);
        expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
      });
    });
  });
});
