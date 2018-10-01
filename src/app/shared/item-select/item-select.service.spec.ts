import { ItemSelectService } from './item-select.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ItemSelectionsState } from './item-select.reducer';
import { AppState } from '../../app.reducer';
import {
  ItemSelectionDeselectAction,
  ItemSelectionInitialDeselectAction,
  ItemSelectionInitialSelectAction, ItemSelectionResetAction,
  ItemSelectionSelectAction, ItemSelectionSwitchAction
} from './item-select.actions';

describe('ItemSelectService', () => {
  let service: ItemSelectService;

  const mockItemId = 'id1';

  const store: Store<ItemSelectionsState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });

  const appStore: Store<AppState> = jasmine.createSpyObj('appStore', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });

  beforeEach(() => {
    service = new ItemSelectService(store, appStore);
  });

  describe('when the initialSelect method is triggered', () => {
    beforeEach(() => {
      service.initialSelect(mockItemId);
    });

    it('ItemSelectionInitialSelectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ItemSelectionInitialSelectAction(mockItemId));
    });
  });

  describe('when the initialDeselect method is triggered', () => {
    beforeEach(() => {
      service.initialDeselect(mockItemId);
    });

    it('ItemSelectionInitialDeselectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ItemSelectionInitialDeselectAction(mockItemId));
    });
  });

  describe('when the select method is triggered', () => {
    beforeEach(() => {
      service.select(mockItemId);
    });

    it('ItemSelectionSelectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ItemSelectionSelectAction(mockItemId));
    });
  });

  describe('when the deselect method is triggered', () => {
    beforeEach(() => {
      service.deselect(mockItemId);
    });

    it('ItemSelectionDeselectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ItemSelectionDeselectAction(mockItemId));
    });
  });

  describe('when the switch method is triggered', () => {
    beforeEach(() => {
      service.switch(mockItemId);
    });

    it('ItemSelectionSwitchAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ItemSelectionSwitchAction(mockItemId));
    });
  });

  describe('when the reset method is triggered', () => {
    beforeEach(() => {
      service.reset();
    });

    it('ItemSelectionInitialSelectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ItemSelectionResetAction(null));
    });
  });

});
