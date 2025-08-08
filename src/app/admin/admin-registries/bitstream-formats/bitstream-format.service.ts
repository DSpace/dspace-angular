import { Injectable } from '@angular/core';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import {
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../../app.reducer';
import {
  BitstreamFormatsRegistryDeselectAction,
  BitstreamFormatsRegistryDeselectAllAction,
  BitstreamFormatsRegistrySelectAction,
} from './bitstream-format.actions';
import { BitstreamFormatRegistryState } from './bitstream-format.reducers';


export const bitstreamFormatsStateSelector = (state: AppState) => state.bitstreamFormats;
const selectedBitstreamFormatSelector = createSelector(
  bitstreamFormatsStateSelector,
  (bitstreamFormatRegistryState: BitstreamFormatRegistryState) => bitstreamFormatRegistryState.selectedBitstreamFormats,
);

/**
 * A service responsible for fetching/sending data from/to the REST API on the bitstreamformats endpoint
 */
@Injectable({ providedIn: 'root' })
export class BitstreamFormatService {

  constructor(
    protected store: Store<AppState>,
  ) {
  }

  /**
   * Gets all the selected BitstreamFormats from the store
   */
  public getSelectedBitstreamFormats(): Observable<BitstreamFormat[]> {
    return this.store.pipe(select(selectedBitstreamFormatSelector));
  }

  /**
   * Adds a BistreamFormat to the selected BitstreamFormats in the store
   * @param bitstreamFormat
   */
  public selectBitstreamFormat(bitstreamFormat: BitstreamFormat) {
    this.store.dispatch(new BitstreamFormatsRegistrySelectAction(bitstreamFormat));
  }

  /**
   * Removes a BistreamFormat from the list of selected BitstreamFormats in the store
   * @param bitstreamFormat
   */
  public deselectBitstreamFormat(bitstreamFormat: BitstreamFormat) {
    this.store.dispatch(new BitstreamFormatsRegistryDeselectAction(bitstreamFormat));
  }

  /**
   * Removes all BitstreamFormats from the list of selected BitstreamFormats in the store
   */
  public deselectAllBitstreamFormats() {
    this.store.dispatch(new BitstreamFormatsRegistryDeselectAllAction());
  }
}
