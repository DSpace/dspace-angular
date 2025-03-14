import {
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid,
} from '../../../shared/mocks/notifications.mock';
import {
  AddTopicsAction,
  RetrieveAllTopicsAction,
  RetrieveAllTopicsErrorAction,
} from './quality-assurance-topics.actions';
import {
  qualityAssuranceTopicsReducer,
  QualityAssuranceTopicState,
} from './quality-assurance-topics.reducer';

describe('qualityAssuranceTopicsReducer test suite', () => {
  let qualityAssuranceTopicInitialState: QualityAssuranceTopicState;
  const elementPerPage = 3;
  const currentPage = 0;

  beforeEach(() => {
    qualityAssuranceTopicInitialState = {
      topics: [],
      processing: false,
      loaded: false,
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    };
  });

  it('Action RETRIEVE_ALL_TOPICS should set the State property "processing" to TRUE', () => {
    const expectedState = qualityAssuranceTopicInitialState;
    expectedState.processing = true;

    const action = new RetrieveAllTopicsAction(elementPerPage, currentPage, 'ENRICH!MORE!ABSTRACT');
    const newState = qualityAssuranceTopicsReducer(qualityAssuranceTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action RETRIEVE_ALL_TOPICS_ERROR should change the State to initial State but processing, loaded, and currentPage', () => {
    const expectedState = qualityAssuranceTopicInitialState;
    expectedState.processing = false;
    expectedState.loaded = true;
    expectedState.currentPage = 0;

    const action = new RetrieveAllTopicsErrorAction();
    const newState = qualityAssuranceTopicsReducer(qualityAssuranceTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action ADD_TOPICS should populate the State with Quality Assurance topics', () => {
    const expectedState = {
      topics: [ qualityAssuranceTopicObjectMorePid, qualityAssuranceTopicObjectMoreAbstract ],
      processing: false,
      loaded: true,
      totalPages: 1,
      currentPage: 0,
      totalElements: 2,
    };

    const action = new AddTopicsAction(
      [ qualityAssuranceTopicObjectMorePid, qualityAssuranceTopicObjectMoreAbstract ],
      1, 0, 2,
    );
    const newState = qualityAssuranceTopicsReducer(qualityAssuranceTopicInitialState, action);

    expect(newState).toEqual(expectedState);
  });
});
