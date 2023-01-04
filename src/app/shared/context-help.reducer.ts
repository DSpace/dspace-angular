import { ContextHelpModel } from './context-help.model';
import { ContextHelpAction, ContextHelpActionTypes } from './context-help.actions';

export type ContextHelpModels = {
  [id: string]: ContextHelpModel;
};

export interface ContextHelpState {
  allIconsVisible: boolean;
  models: ContextHelpModels;
}

export function contextHelpReducer(state: ContextHelpState, action: ContextHelpAction): ContextHelpState {
  switch (action.type) {
    case ContextHelpActionTypes.CONTEXT_HELP_TOGGLE_ICONS: {
      return {...state, allIconsVisible: true};
    }
    case ContextHelpActionTypes.CONTEXT_HELP_ADD: {
      const newModels = {...state.models, [action.model.id]: action.model};
      return {...state, models: newModels};
    }
    case ContextHelpActionTypes.CONTEXT_HELP_REMOVE: {
      const {[action.id]: _, ...remainingModels} = state.models;
      return {...state, models: remainingModels};
    }
    case ContextHelpActionTypes.CONTEXT_HELP_TOGGLE_TOOLTIP: {
      return modifyTooltipVisibility(state, action.id, v => !v);
    }
    case ContextHelpActionTypes.CONTEXT_HELP_SHOW_TOOLTIP: {
      return modifyTooltipVisibility(state, action.id, _ => true);
    }
    case ContextHelpActionTypes.CONTEXT_HELP_HIDE_TOOLTIP: {
      return modifyTooltipVisibility(state, action.id, _ => false);
    }
    default: {
      return state;
    }
  }
}

function modifyTooltipVisibility(state: ContextHelpState, id: string, modify: (vis: boolean) => boolean)
  : ContextHelpState {
  const {[id]: matchingModel, ...otherModels} = state.models;
  const modifiedModel = {...matchingModel, tooltipVisible: modify(matchingModel.tooltipVisible)};
  const newModels = {...otherModels, [id]: modifiedModel};
  return {...state, models: newModels};
}
