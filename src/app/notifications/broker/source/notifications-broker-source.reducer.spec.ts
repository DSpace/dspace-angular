import {
    AddSourceAction,
    RetrieveAllSourceAction,
    RetrieveAllSourceErrorAction
  } from './notifications-broker-source.actions';
  import { notificationsBrokerSourceReducer, NotificationsBrokerSourceState } from './notifications-broker-source.reducer';
  import {
    notificationsBrokerSourceObjectMoreAbstract,
    notificationsBrokerSourceObjectMorePid
  } from '../../../shared/mocks/notifications.mock';

  describe('notificationsBrokerSourceReducer test suite', () => {
    let notificationsBrokerSourceInitialState: NotificationsBrokerSourceState;
    const elementPerPage = 3;
    const currentPage = 0;

    beforeEach(() => {
      notificationsBrokerSourceInitialState = {
        source: [],
        processing: false,
        loaded: false,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0
      };
    });

    it('Action RETRIEVE_ALL_SOURCE should set the State property "processing" to TRUE', () => {
      const expectedState = notificationsBrokerSourceInitialState;
      expectedState.processing = true;

      const action = new RetrieveAllSourceAction(elementPerPage, currentPage);
      const newState = notificationsBrokerSourceReducer(notificationsBrokerSourceInitialState, action);

      expect(newState).toEqual(expectedState);
    });

    it('Action RETRIEVE_ALL_SOURCE_ERROR should change the State to initial State but processing, loaded, and currentPage', () => {
      const expectedState = notificationsBrokerSourceInitialState;
      expectedState.processing = false;
      expectedState.loaded = true;
      expectedState.currentPage = 0;

      const action = new RetrieveAllSourceErrorAction();
      const newState = notificationsBrokerSourceReducer(notificationsBrokerSourceInitialState, action);

      expect(newState).toEqual(expectedState);
    });

    it('Action ADD_SOURCE should populate the State with Notifications Broker source', () => {
      const expectedState = {
        source: [ notificationsBrokerSourceObjectMorePid, notificationsBrokerSourceObjectMoreAbstract ],
        processing: false,
        loaded: true,
        totalPages: 1,
        currentPage: 0,
        totalElements: 2
      };

      const action = new AddSourceAction(
        [ notificationsBrokerSourceObjectMorePid, notificationsBrokerSourceObjectMoreAbstract ],
        1, 0, 2
      );
      const newState = notificationsBrokerSourceReducer(notificationsBrokerSourceInitialState, action);

      expect(newState).toEqual(expectedState);
    });
  });
