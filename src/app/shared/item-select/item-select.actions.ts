import { type } from '../ngrx/type';
import { Action } from '@ngrx/store';

export const ItemSelectionActionTypes = {
  INITIAL_DESELECT: type('dspace/item-select/INITIAL_DESELECT'),
  INITIAL_SELECT: type('dspace/item-select/INITIAL_SELECT'),
  SELECT: type('dspace/item-select/SELECT'),
  DESELECT: type('dspace/item-select/DESELECT'),
  SWITCH: type('dspace/item-select/SWITCH'),
  RESET: type('dspace/item-select/RESET')
};

export class ItemSelectionAction implements Action {
  /**
   * UUID of the item a select action can be performed on
   */
  id: string;

  /**
   * Type of action that will be performed
   */
  type;

  /**
   * Initialize with the item's UUID
   * @param {string} id of the item
   */
  constructor(id: string) {
    this.id = id;
  }
}

/* tslint:disable:max-classes-per-file */
/**
 * Used to set the initial state to deselected
 */
export class ItemSelectionInitialDeselectAction extends ItemSelectionAction {
  type = ItemSelectionActionTypes.INITIAL_DESELECT;
}

/**
 * Used to set the initial state to selected
 */
export class ItemSelectionInitialSelectAction extends ItemSelectionAction {
  type = ItemSelectionActionTypes.INITIAL_SELECT;
}

/**
 * Used to select an item
 */
export class ItemSelectionSelectAction extends ItemSelectionAction {
  type = ItemSelectionActionTypes.SELECT;
}

/**
 * Used to deselect an item
 */
export class ItemSelectionDeselectAction extends ItemSelectionAction {
  type = ItemSelectionActionTypes.DESELECT;
}

/**
 * Used to switch an item between selected and deselected
 */
export class ItemSelectionSwitchAction extends ItemSelectionAction {
  type = ItemSelectionActionTypes.SWITCH;
}

/**
 * Used to reset all item's selected to be deselected
 */
export class ItemSelectionResetAction extends ItemSelectionAction {
  type = ItemSelectionActionTypes.RESET;
}
/* tslint:enable:max-classes-per-file */
