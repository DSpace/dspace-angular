import { of } from 'rxjs';

import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ResponsiveColumnSizes } from '../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';

export function getItemBitstreamsServiceStub(): ItemBitstreamsServiceStub {
  return new ItemBitstreamsServiceStub();
}

export class ItemBitstreamsServiceStub {
  getSelectionAction$ = jasmine.createSpy('getSelectedBitstream$').and
    .returnValue(of(null));

  getSelectedBitstream = jasmine.createSpy('getSelectedBitstream').and
    .returnValue(null);

  hasSelectedBitstream = jasmine.createSpy('hasSelectedBitstream').and
    .returnValue(false);

  selectBitstreamEntry = jasmine.createSpy('selectBitstreamEntry');

  clearSelection = jasmine.createSpy('clearSelection');

  cancelSelection = jasmine.createSpy('cancelSelection');

  moveSelectedBitstreamUp = jasmine.createSpy('moveSelectedBitstreamUp');

  moveSelectedBitstreamDown = jasmine.createSpy('moveSelectedBitstreamDown');

  performBitstreamMoveRequest = jasmine.createSpy('performBitstreamMoveRequest');

  getPerformingMoveRequest = jasmine.createSpy('getPerformingMoveRequest').and.returnValue(false);

  getPerformingMoveRequest$ = jasmine.createSpy('getPerformingMoveRequest$').and.returnValue(of(false));

  getInitialBundlesPaginationOptions = jasmine.createSpy('getInitialBundlesPaginationOptions').and
    .returnValue(new PaginationComponentOptions());

  getInitialBitstreamsPaginationOptions = jasmine.createSpy('getInitialBitstreamsPaginationOptions').and
    .returnValue(new PaginationComponentOptions());

  getColumnSizes = jasmine.createSpy('getColumnSizes').and
    .returnValue(
      new ResponsiveTableSizes([
        new ResponsiveColumnSizes(2, 2, 3, 4, 4),
        new ResponsiveColumnSizes(2, 3, 3, 3, 3),
        new ResponsiveColumnSizes(2, 2, 2, 2, 2),
        new ResponsiveColumnSizes(6, 5, 4, 3, 3),
      ]),
    );

  displayNotifications = jasmine.createSpy('displayNotifications');

  displayFailedResponseNotifications = jasmine.createSpy('displayFailedResponseNotifications');

  displayErrorNotification = jasmine.createSpy('displayErrorNotification');

  displaySuccessFulResponseNotifications = jasmine.createSpy('displaySuccessFulResponseNotifications');

  displaySuccessNotification = jasmine.createSpy('displaySuccessNotification');

  removeMarkedBitstreams = jasmine.createSpy('removeMarkedBitstreams').and
    .returnValue(createSuccessfulRemoteDataObject$({}));

  mapBitstreamsToTableEntries = jasmine.createSpy('mapBitstreamsToTableEntries').and
    .returnValue([]);

  nameToHeader = jasmine.createSpy('nameToHeader').and.returnValue('header');

  stripWhiteSpace = jasmine.createSpy('stripWhiteSpace').and.returnValue('string');

  announceSelect = jasmine.createSpy('announceSelect');

  announceMove = jasmine.createSpy('announceMove');

  announceCancel = jasmine.createSpy('announceCancel');
}
