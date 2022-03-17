import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { notificationsReducers } from './notifications.reducer';
import { NotificationsStateService } from './notifications-state.service';
import {
  notificationsBrokerSourceObjectMissingPid,
  notificationsBrokerSourceObjectMoreAbstract,
  notificationsBrokerSourceObjectMorePid,
  notificationsBrokerTopicObjectMissingPid,
  notificationsBrokerTopicObjectMoreAbstract,
  notificationsBrokerTopicObjectMorePid
} from '../shared/mocks/notifications.mock';
import { RetrieveAllTopicsAction } from './broker/topics/notifications-broker-topics.actions';
import { RetrieveAllSourceAction } from './broker/source/notifications-broker-source.actions';

describe('NotificationsStateService', () => {
  let service: NotificationsStateService;
  let serviceAsAny: any;
  let store: any;
  let initialState: any;

  describe('Topis State', () => {
    function init(mode: string) {
      if (mode === 'empty') {
        initialState = {
          notifications: {
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
          notifications: {
            brokerTopic: {
              topics: [
                notificationsBrokerTopicObjectMorePid,
                notificationsBrokerTopicObjectMoreAbstract,
                notificationsBrokerTopicObjectMissingPid
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
            StoreModule.forRoot({ notifications: notificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service }
          ]
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getNotificationsBrokerTopics', () => {
        it('Should return an empty array', () => {
          const result = service.getNotificationsBrokerTopics();
          const expected = cold('(a)', {
            a: []
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerTopicsTotalPages', () => {
        it('Should return zero (0)', () => {
          const result = service.getNotificationsBrokerTopicsTotalPages();
          const expected = cold('(a)', {
            a: 0
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerTopicsCurrentPage', () => {
        it('Should return minus one (0)', () => {
          const result = service.getNotificationsBrokerTopicsCurrentPage();
          const expected = cold('(a)', {
            a: 0
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerTopicsTotals', () => {
        it('Should return zero (0)', () => {
          const result = service.getNotificationsBrokerTopicsTotals();
          const expected = cold('(a)', {
            a: 0
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerTopicsLoading', () => {
        it('Should return TRUE', () => {
          const result = service.isNotificationsBrokerTopicsLoading();
          const expected = cold('(a)', {
            a: true
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerTopicsLoaded', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerTopicsLoaded();
          const expected = cold('(a)', {
            a: false
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerTopicsProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerTopicsProcessing();
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
            StoreModule.forRoot({ notifications: notificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service }
          ]
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getNotificationsBrokerTopics', () => {
        it('Should return an array of topics', () => {
          const result = service.getNotificationsBrokerTopics();
          const expected = cold('(a)', {
            a: [
              notificationsBrokerTopicObjectMorePid,
              notificationsBrokerTopicObjectMoreAbstract,
              notificationsBrokerTopicObjectMissingPid
            ]
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerTopicsTotalPages', () => {
        it('Should return one (1)', () => {
          const result = service.getNotificationsBrokerTopicsTotalPages();
          const expected = cold('(a)', {
            a: 1
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerTopicsCurrentPage', () => {
        it('Should return minus zero (1)', () => {
          const result = service.getNotificationsBrokerTopicsCurrentPage();
          const expected = cold('(a)', {
            a: 1
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerTopicsTotals', () => {
        it('Should return three (3)', () => {
          const result = service.getNotificationsBrokerTopicsTotals();
          const expected = cold('(a)', {
            a: 3
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerTopicsLoading', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerTopicsLoading();
          const expected = cold('(a)', {
            a: false
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerTopicsLoaded', () => {
        it('Should return TRUE', () => {
          const result = service.isNotificationsBrokerTopicsLoaded();
          const expected = cold('(a)', {
            a: true
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerTopicsProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerTopicsProcessing();
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
            StoreModule.forRoot({ notifications: notificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service }
          ]
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('dispatchRetrieveNotificationsBrokerTopics', () => {
        it('Should call store.dispatch', () => {
          const elementsPerPage = 3;
          const currentPage = 1;
          const action = new RetrieveAllTopicsAction(elementsPerPage, currentPage);
          service.dispatchRetrieveNotificationsBrokerTopics(elementsPerPage, currentPage);
          expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
        });
      });
    });
  });

  describe('Source State', () => {
    function init(mode: string) {
      if (mode === 'empty') {
        initialState = {
          notifications: {
            brokerSource: {
              source: [],
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
          notifications: {
            brokerSource: {
              source: [
                notificationsBrokerSourceObjectMorePid,
                notificationsBrokerSourceObjectMoreAbstract,
                notificationsBrokerSourceObjectMissingPid
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

    describe('Testing methods with empty source objects', () => {
      beforeEach(async () => {
        init('empty');
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({ notifications: notificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service }
          ]
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getNotificationsBrokerSource', () => {
        it('Should return an empty array', () => {
          const result = service.getNotificationsBrokerSource();
          const expected = cold('(a)', {
            a: []
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerSourceTotalPages', () => {
        it('Should return zero (0)', () => {
          const result = service.getNotificationsBrokerSourceTotalPages();
          const expected = cold('(a)', {
            a: 0
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerSourcesCurrentPage', () => {
        it('Should return minus one (0)', () => {
          const result = service.getNotificationsBrokerSourceCurrentPage();
          const expected = cold('(a)', {
            a: 0
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerSourceTotals', () => {
        it('Should return zero (0)', () => {
          const result = service.getNotificationsBrokerSourceTotals();
          const expected = cold('(a)', {
            a: 0
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerSourceLoading', () => {
        it('Should return TRUE', () => {
          const result = service.isNotificationsBrokerSourceLoading();
          const expected = cold('(a)', {
            a: true
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerSourceLoaded', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerSourceLoaded();
          const expected = cold('(a)', {
            a: false
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerSourceProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerSourceProcessing();
          const expected = cold('(a)', {
            a: false
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
            StoreModule.forRoot({ notifications: notificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service }
          ]
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('getNotificationsBrokerSource', () => {
        it('Should return an array of Source', () => {
          const result = service.getNotificationsBrokerSource();
          const expected = cold('(a)', {
            a: [
              notificationsBrokerSourceObjectMorePid,
              notificationsBrokerSourceObjectMoreAbstract,
              notificationsBrokerSourceObjectMissingPid
            ]
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerSourceTotalPages', () => {
        it('Should return one (1)', () => {
          const result = service.getNotificationsBrokerSourceTotalPages();
          const expected = cold('(a)', {
            a: 1
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerSourceCurrentPage', () => {
        it('Should return minus zero (1)', () => {
          const result = service.getNotificationsBrokerSourceCurrentPage();
          const expected = cold('(a)', {
            a: 1
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('getNotificationsBrokerSourceTotals', () => {
        it('Should return three (3)', () => {
          const result = service.getNotificationsBrokerSourceTotals();
          const expected = cold('(a)', {
            a: 3
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerSourceLoading', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerSourceLoading();
          const expected = cold('(a)', {
            a: false
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerSourceLoaded', () => {
        it('Should return TRUE', () => {
          const result = service.isNotificationsBrokerSourceLoaded();
          const expected = cold('(a)', {
            a: true
          });
          expect(result).toBeObservable(expected);
        });
      });

      describe('isNotificationsBrokerSourceProcessing', () => {
        it('Should return FALSE', () => {
          const result = service.isNotificationsBrokerSourceProcessing();
          const expected = cold('(a)', {
            a: false
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
            StoreModule.forRoot({ notifications: notificationsReducers } as any),
          ],
          providers: [
            provideMockStore({ initialState }),
            { provide: NotificationsStateService, useValue: service }
          ]
        }).compileComponents();
      });

      beforeEach(() => {
        store = TestBed.get(Store);
        service = new NotificationsStateService(store);
        serviceAsAny = service;
        spyOn(store, 'dispatch');
      });

      describe('dispatchRetrieveNotificationsBrokerSource', () => {
        it('Should call store.dispatch', () => {
          const elementsPerPage = 3;
          const currentPage = 1;
          const action = new RetrieveAllSourceAction(elementsPerPage, currentPage);
          service.dispatchRetrieveNotificationsBrokerSource(elementsPerPage, currentPage);
          expect(serviceAsAny.store.dispatch).toHaveBeenCalledWith(action);
        });
      });
    });
   });


});
