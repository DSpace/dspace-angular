import { QualityAssuranceTopicObject } from '../../../core/notifications/qa/models/quality-assurance-topic.model';
import {
  QualityAssuranceTopicActionTypes,
  QualityAssuranceTopicsActions,
} from './quality-assurance-topics.actions';

/**
 * The interface representing the Quality Assurance topic state.
 */
export interface QualityAssuranceTopicState {
  topics: QualityAssuranceTopicObject[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

/**
 * Used for the Quality Assurance topic state initialization.
 */
const qualityAssuranceTopicInitialState: QualityAssuranceTopicState = {
  topics: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
};

/**
 * The Quality Assurance Topic Reducer
 *
 * @param state
 *    the current state initialized with qualityAssuranceTopicInitialState
 * @param action
 *    the action to perform on the state
 * @return QualityAssuranceTopicState
 *    the new state
 */
export function qualityAssuranceTopicsReducer(state = qualityAssuranceTopicInitialState, action: QualityAssuranceTopicsActions): QualityAssuranceTopicState {
  switch (action.type) {
    case QualityAssuranceTopicActionTypes.RETRIEVE_ALL_TOPICS: {
      return Object.assign({}, state, {
        topics: [],
        processing: true,
      });
    }

    case QualityAssuranceTopicActionTypes.ADD_TOPICS: {
      return Object.assign({}, state, {
        topics: action.payload.topics,
        processing: false,
        loaded: true,
        totalPages: action.payload.totalPages,
        currentPage: state.currentPage,
        totalElements: action.payload.totalElements,
      });
    }

    case QualityAssuranceTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR: {
      return Object.assign({}, state, {
        processing: false,
        loaded: true,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
      });
    }

    default: {
      return state;
    }
  }
}
