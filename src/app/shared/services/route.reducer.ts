import { Params } from '@angular/router';
import {
  AddParameterAction,
  AddQueryParameterAction,
  RouteAction,
  RouteActionTypes, SetParametersAction, SetQueryParametersAction
} from './route.action';

export interface RouteState {
  queryParams: Params;
  params: Params;
}

const initialState: RouteState = {
  queryParams: {},
  params: {}
};

export function routeReducer(state = initialState, action: RouteAction): RouteState {
  switch (action.type) {
    case RouteActionTypes.SET_PARAMETERS: {
      return setParameters(state, action as SetParametersAction, 'params');
    }
    case RouteActionTypes.SET_QUERY_PARAMETERS: {
      return setParameters(state, action as SetQueryParametersAction, 'queryParams');
    }
    case RouteActionTypes.ADD_PARAMETER: {
      return addParameter(state, action as AddParameterAction, 'params');
    }
    case RouteActionTypes.ADD_QUERY_PARAMETER: {
      return addParameter(state, action as AddQueryParameterAction, 'queryParams');
    }
    default: {
      return state;
    }
  }
}

function addParameter(state: RouteState, action: AddParameterAction | AddQueryParameterAction, paramType: string): RouteState {
  const subState = state[paramType];
  const existingValues = subState[action.payload.key] || [];
  const newValues = [...existingValues, action.payload.value];
  const newSubstate = Object.assign(subState, { [action.payload.key]: newValues });
  return Object.assign({}, state, { [paramType]: newSubstate });
}

function setParameters(state: RouteState, action: SetParametersAction | SetQueryParametersAction, paramType: string): RouteState {
  return Object.assign({}, state, { [paramType]: action.payload });
}
