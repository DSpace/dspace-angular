import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import {
  QualityAssuranceSourceActions,
  QualityAssuranceSourceActionTypes,
} from './quality-assurance-source.actions';

/**
 * The interface representing the Quality Assurance source state.
 */
export interface QualityAssuranceSourceState {
  source: QualityAssuranceSourceObject[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

/**
 * Used for the Quality Assurance source state initialization.
 */
const qualityAssuranceSourceInitialState: QualityAssuranceSourceState = {
  source: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,
};

/**
 * The Quality Assurance Source Reducer
 *
 * @param state
 *    the current state initialized with qualityAssuranceSourceInitialState
 * @param action
 *    the action to perform on the state
 * @return QualityAssuranceSourceState
 *    the new state
 */
export function qualityAssuranceSourceReducer(state = qualityAssuranceSourceInitialState, action: QualityAssuranceSourceActions): QualityAssuranceSourceState {
  switch (action.type) {
    case QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE: {
      return Object.assign({}, state, {
        source: [],
        processing: true,
      });
    }

    case QualityAssuranceSourceActionTypes.ADD_SOURCE: {
      return Object.assign({}, state, {
        source: action.payload.source,
        processing: false,
        loaded: true,
        totalPages: action.payload.totalPages,
        currentPage: state.currentPage,
        totalElements: action.payload.totalElements,
      });
    }

    case QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE_ERROR: {
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
