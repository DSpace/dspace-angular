import {
  qualityAssuranceSourceObjectMoreAbstract,
  qualityAssuranceSourceObjectMorePid,
} from '../../../shared/mocks/notifications.mock';
import {
  AddSourceAction,
  RetrieveAllSourceAction,
  RetrieveAllSourceErrorAction,
} from './quality-assurance-source.actions';
import {
  qualityAssuranceSourceReducer,
  QualityAssuranceSourceState,
} from './quality-assurance-source.reducer';

describe('qualityAssuranceSourceReducer test suite', () => {
  let qualityAssuranceSourceInitialState: QualityAssuranceSourceState;
  const elementPerPage = 3;
  const currentPage = 0;

  beforeEach(() => {
    qualityAssuranceSourceInitialState = {
      source: [],
      processing: false,
      loaded: false,
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    };
  });

  it('Action RETRIEVE_ALL_SOURCE should set the State property "processing" to TRUE', () => {
    const expectedState = qualityAssuranceSourceInitialState;
    expectedState.processing = true;

    const action = new RetrieveAllSourceAction(elementPerPage, currentPage);
    const newState = qualityAssuranceSourceReducer(qualityAssuranceSourceInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action RETRIEVE_ALL_SOURCE_ERROR should change the State to initial State but processing, loaded, and currentPage', () => {
    const expectedState = qualityAssuranceSourceInitialState;
    expectedState.processing = false;
    expectedState.loaded = true;
    expectedState.currentPage = 0;

    const action = new RetrieveAllSourceErrorAction();
    const newState = qualityAssuranceSourceReducer(qualityAssuranceSourceInitialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('Action ADD_SOURCE should populate the State with Quality Assurance source', () => {
    const expectedState = {
      source: [ qualityAssuranceSourceObjectMorePid, qualityAssuranceSourceObjectMoreAbstract ],
      processing: false,
      loaded: true,
      totalPages: 1,
      currentPage: 0,
      totalElements: 2,
    };

    const action = new AddSourceAction(
      [ qualityAssuranceSourceObjectMorePid, qualityAssuranceSourceObjectMoreAbstract ],
      1, 0, 2,
    );
    const newState = qualityAssuranceSourceReducer(qualityAssuranceSourceInitialState, action);

    expect(newState).toEqual(expectedState);
  });
});
