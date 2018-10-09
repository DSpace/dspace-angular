import { ObjectSelectService } from './object-select.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ObjectSelectionsState } from './object-select.reducer';
import { AppState } from '../../app.reducer';
import {
  ObjectSelectionDeselectAction,
  ObjectSelectionInitialDeselectAction,
  ObjectSelectionInitialSelectAction, ObjectSelectionResetAction,
  ObjectSelectionSelectAction, ObjectSelectionSwitchAction
} from './object-select.actions';

describe('ObjectSelectService', () => {
  let service: ObjectSelectService;

  const mockObjectId = 'id1';

  const store: Store<ObjectSelectionsState> = jasmine.createSpyObj('store', {
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
    service = new ObjectSelectService(store, appStore);
  });

  describe('when the initialSelect method is triggered', () => {
    beforeEach(() => {
      service.initialSelect(mockObjectId);
    });

    it('ObjectSelectionInitialSelectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ObjectSelectionInitialSelectAction(mockObjectId));
    });
  });

  describe('when the initialDeselect method is triggered', () => {
    beforeEach(() => {
      service.initialDeselect(mockObjectId);
    });

    it('ObjectSelectionInitialDeselectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ObjectSelectionInitialDeselectAction(mockObjectId));
    });
  });

  describe('when the select method is triggered', () => {
    beforeEach(() => {
      service.select(mockObjectId);
    });

    it('ObjectSelectionSelectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ObjectSelectionSelectAction(mockObjectId));
    });
  });

  describe('when the deselect method is triggered', () => {
    beforeEach(() => {
      service.deselect(mockObjectId);
    });

    it('ObjectSelectionDeselectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ObjectSelectionDeselectAction(mockObjectId));
    });
  });

  describe('when the switch method is triggered', () => {
    beforeEach(() => {
      service.switch(mockObjectId);
    });

    it('ObjectSelectionSwitchAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ObjectSelectionSwitchAction(mockObjectId));
    });
  });

  describe('when the reset method is triggered', () => {
    beforeEach(() => {
      service.reset();
    });

    it('ObjectSelectionInitialSelectAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new ObjectSelectionResetAction(null));
    });
  });

});
