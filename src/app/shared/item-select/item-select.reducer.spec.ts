import { ItemSelectionSelectAction } from './item-select.actions';

class NullAction extends ItemSelectionSelectAction {
  type = null;

  constructor() {
    super(undefined);
  }
}

fdescribe('itemSelectionReducer', () => {

});
