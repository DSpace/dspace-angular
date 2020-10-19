import {
  RetrieveAllTopicsAction,
  RetrieveAllTopicsErrorAction,
  AddTopicsAction
} from './openaire-broker-topic.actions';
import {
  openaireBrokerTopicReducer,
  OpenaireBrokerTopicState
} from './openaire-broker-topic.reducer';
import {
  openaireBrokerTopicObjectMorePid,
  openaireBrokerTopicObjectMoreAbstract
} from '../../shared/mocks/openaire.mock';

describe('openaireBrokerTopicReducer test suite', () => {
  let openaireBrokerTopicInitialState: OpenaireBrokerTopicState;
  const elementPerPage = 3;
  const currentPage = 0;

  beforeEach(() => {
    openaireBrokerTopicInitialState = {
      topics: [],
      processing: false,
      loaded: false,
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
      totalLoadedPages: 0
    };
  });

  it('Action RETRIEVE_ALL_TOPICS should set the State property "processing" to TRUE', () => {
    const expectedState = openaireBrokerTopicInitialState;
    expectedState.processing = true;

    const action = new RetrieveAllTopicsAction(elementPerPage, currentPage);
    const newState = openaireBrokerTopicReducer(openaireBrokerTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action RETRIEVE_ALL_TOPICS_ERROR should change the State to initial State but processing, loaded, and currentPage', () => {
    const expectedState = openaireBrokerTopicInitialState;
    expectedState.processing = false;
    expectedState.loaded = true;
    expectedState.currentPage = 0;

    const action = new RetrieveAllTopicsErrorAction();
    const newState = openaireBrokerTopicReducer(openaireBrokerTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action ADD_TOPICS should populate the State with OpenAIRE Broker topics', () => {
    const expectedState = {
      topics: [ openaireBrokerTopicObjectMorePid, openaireBrokerTopicObjectMoreAbstract ],
      processing: false,
      loaded: true,
      totalPages: 1,
      currentPage: 0,
      totalElements: 2,
      totalLoadedPages: 0
    }

    const action = new AddTopicsAction(
      [ openaireBrokerTopicObjectMorePid, openaireBrokerTopicObjectMoreAbstract ],
      1, 0, 2
    );
    const newState = openaireBrokerTopicReducer(openaireBrokerTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });
});
