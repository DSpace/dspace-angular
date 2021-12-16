import {
  CorrelationIdAction,
  CorrelationIDActionTypes,
  SetCorrelationIdAction
} from './correlation-id.actions';
import { AppState } from '../app.reducer';

const initialState = null;

export const correlationIdSelector = (state: AppState) => state.correlationId;

export const correlationIdReducer = (state = initialState, action: CorrelationIdAction): string => {
  switch (action.type) {
    case CorrelationIDActionTypes.SET: {
      return (action as SetCorrelationIdAction).payload;
    }
    default: {
      return state;
    }
  }
};
