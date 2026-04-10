import { waitForAsync } from '@angular/core/testing';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { createMockStore } from '@ngrx/store/testing';

import {
  BitstreamFormatsRegistryDeselectAction,
  BitstreamFormatsRegistryDeselectAllAction,
  BitstreamFormatsRegistrySelectAction,
} from './bitstream-format.actions';
import { BitstreamFormatService } from './bitstream-format.service';

describe('BitstreamFormatDataService', () => {
  let service: BitstreamFormatService;

  const store: any = createMockStore({});

  function initTestService() {
    return new BitstreamFormatService(store);
  }

  describe('selectBitstreamFormat', () => {
    beforeEach(waitForAsync(() => {
      service = initTestService();
      spyOn(store, 'dispatch');
    }));
    it('should add a selected bitstream to the store', () => {
      const format = new BitstreamFormat();
      format.uuid = 'uuid';

      service.selectBitstreamFormat(format);
      expect(store.dispatch).toHaveBeenCalledWith(new BitstreamFormatsRegistrySelectAction(format));
    });
  });

  describe('deselectBitstreamFormat', () => {
    beforeEach(waitForAsync(() => {
      service = initTestService();
      spyOn(store, 'dispatch');
    }));
    it('should remove a bitstream from the store', () => {
      const format = new BitstreamFormat();
      format.uuid = 'uuid';

      service.deselectBitstreamFormat(format);
      expect(store.dispatch).toHaveBeenCalledWith(new BitstreamFormatsRegistryDeselectAction(format));
    });
  });

  describe('deselectAllBitstreamFormats', () => {
    beforeEach(waitForAsync(() => {
      service = initTestService();
      spyOn(store, 'dispatch');

    }));
    it('should remove all bitstreamFormats from the store', () => {
      service.deselectAllBitstreamFormats();
      expect(store.dispatch).toHaveBeenCalledWith(new BitstreamFormatsRegistryDeselectAllAction());
    });
  });

});
