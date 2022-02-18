import {
  AddTopicsAction,
  RetrieveAllTopicsAction,
  RetrieveAllTopicsErrorAction
} from './notifications-broker-topics.actions';
import { notificationsBrokerTopicsReducer, NotificationsBrokerTopicState } from './notifications-broker-topics.reducer';
import {
  notificationsBrokerTopicObjectMoreAbstract,
  notificationsBrokerTopicObjectMorePid
} from '../../../shared/mocks/notifications.mock';

describe('notificationsBrokerTopicsReducer test suite', () => {
  let notificationsBrokerTopicInitialState: NotificationsBrokerTopicState;
  const elementPerPage = 3;
  const currentPage = 0;

  beforeEach(() => {
    notificationsBrokerTopicInitialState = {
      topics: [],
      processing: false,
      loaded: false,
      totalPages: 0,
      currentPage: 0,
      totalElements: 0
    };
  });

  it('Action RETRIEVE_ALL_TOPICS should set the State property "processing" to TRUE', () => {
    const expectedState = notificationsBrokerTopicInitialState;
    expectedState.processing = true;

    const action = new RetrieveAllTopicsAction(elementPerPage, currentPage);
    const newState = notificationsBrokerTopicsReducer(notificationsBrokerTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action RETRIEVE_ALL_TOPICS_ERROR should change the State to initial State but processing, loaded, and currentPage', () => {
    const expectedState = notificationsBrokerTopicInitialState;
    expectedState.processing = false;
    expectedState.loaded = true;
    expectedState.currentPage = 0;

    const action = new RetrieveAllTopicsErrorAction();
    const newState = notificationsBrokerTopicsReducer(notificationsBrokerTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action ADD_TOPICS should populate the State with Notifications Broker topics', () => {
    const expectedState = {
      topics: [ notificationsBrokerTopicObjectMorePid, notificationsBrokerTopicObjectMoreAbstract ],
      processing: false,
      loaded: true,
      totalPages: 1,
      currentPage: 0,
      totalElements: 2
    };

    const action = new AddTopicsAction(
      [ notificationsBrokerTopicObjectMorePid, notificationsBrokerTopicObjectMoreAbstract ],
      1, 0, 2
    );
    const newState = notificationsBrokerTopicsReducer(notificationsBrokerTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });
});
