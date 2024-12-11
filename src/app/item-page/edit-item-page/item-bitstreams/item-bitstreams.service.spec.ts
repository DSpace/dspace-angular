import {
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ObjectUpdatesServiceStub } from '../../../core/data/object-updates/object-updates.service.stub';
import { RequestService } from '../../../core/data/request.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../../core/shared/bitstream-format.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { LiveRegionService } from '../../../shared/live-region/live-region.service';
import { getLiveRegionServiceStub } from '../../../shared/live-region/live-region.service.stub';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { BitstreamDataServiceStub } from '../../../shared/testing/bitstream-data-service.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import {
  ItemBitstreamsService,
  SelectedBitstreamTableEntry,
} from './item-bitstreams.service';
import createSpy = jasmine.createSpy;
import { MoveOperation } from 'fast-json-patch';

describe('ItemBitstreamsService', () => {
  let service: ItemBitstreamsService;
  let notificationsService: NotificationsService;
  let translateService: TranslateService;
  let objectUpdatesService: ObjectUpdatesService;
  let bitstreamDataService: BitstreamDataService;
  let bundleDataService: BundleDataService;
  let dsoNameService: DSONameService;
  let requestService: RequestService;
  let liveRegionService: LiveRegionService;

  beforeEach(() => {
    notificationsService = new NotificationsServiceStub() as any;
    translateService = getMockTranslateService();
    objectUpdatesService = new ObjectUpdatesServiceStub() as any;
    bitstreamDataService = new BitstreamDataServiceStub() as any;
    bundleDataService = jasmine.createSpyObj('bundleDataService', {
      patch: createSuccessfulRemoteDataObject$(new Bundle()),
    });
    dsoNameService = new DSONameServiceMock() as any;
    requestService = jasmine.createSpyObj('requestService', {
      setStaleByHrefSubstring: of(true),
    });
    liveRegionService = getLiveRegionServiceStub();

    service = new ItemBitstreamsService(
      notificationsService,
      translateService,
      objectUpdatesService,
      bitstreamDataService,
      bundleDataService,
      dsoNameService,
      requestService,
      liveRegionService,
    );
  });

  const defaultEntry: SelectedBitstreamTableEntry = {
    bitstream: {
      name: 'bitstream name',
    } as any,
    bundle: Object.assign(new Bundle(), {
      _links: { self: { href: 'self_link' } },
    }),
    bundleSize: 10,
    currentPosition: 0,
    originalPosition: 0,
  };

  describe('selectBitstreamEntry', () => {
    it('should correctly make getSelectedBitstream$ emit', fakeAsync(() => {
      const emittedActions = [];

      service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();

      const entry = Object.assign({}, defaultEntry);

      service.selectBitstreamEntry(entry);
      tick();

      expect(emittedActions.length).toBe(2);
      expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });
    }));

    it('should correctly make getSelectedBitstream return the bitstream', () => {
      expect(service.getSelectedBitstream()).toBeNull();

      const entry = Object.assign({}, defaultEntry);

      service.selectBitstreamEntry(entry);
      expect(service.getSelectedBitstream()).toEqual(entry);
    });

    it('should correctly make hasSelectedBitstream return', () => {
      expect(service.hasSelectedBitstream()).toBeFalse();

      const entry = Object.assign({}, defaultEntry);

      service.selectBitstreamEntry(entry);
      expect(service.hasSelectedBitstream()).toBeTrue();
    });

    it('should do nothing if no entry was provided', fakeAsync(() => {
      const emittedActions = [];

      service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();

      const entry = Object.assign({}, defaultEntry);

      service.selectBitstreamEntry(entry);
      tick();

      expect(emittedActions.length).toBe(2);
      expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });

      service.selectBitstreamEntry(null);
      tick();

      expect(emittedActions.length).toBe(2);
      expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });
    }));

    it('should announce the selected bitstream', () => {
      const entry = Object.assign({}, defaultEntry);

      spyOn(service, 'announceSelect');

      service.selectBitstreamEntry(entry);
      expect(service.announceSelect).toHaveBeenCalledWith(entry.bitstream.name);
    });
  });

  describe('clearSelection', () => {
    it('should clear the selected bitstream', fakeAsync(() => {
      const emittedActions = [];

      service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();

      const entry = Object.assign({}, defaultEntry);

      service.selectBitstreamEntry(entry);
      tick();

      expect(emittedActions.length).toBe(2);
      expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });

      service.clearSelection();
      tick();

      expect(emittedActions.length).toBe(3);
      expect(emittedActions[2]).toEqual({ action: 'Cleared', selectedEntry: entry });
    }));

    it('should not do anything if there is no selected bitstream', fakeAsync(() => {
      const emittedActions = [];

      service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();

      service.clearSelection();
      tick();

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();
    }));

    it('should announce the cleared bitstream', () => {
      const entry = Object.assign({}, defaultEntry);

      spyOn(service, 'announceClear');
      service.selectBitstreamEntry(entry);
      service.clearSelection();

      expect(service.announceClear).toHaveBeenCalledWith(entry.bitstream.name);
    });

    it('should display a notification if the selected bitstream was moved', () => {
      const entry = Object.assign({}, defaultEntry,
        {
          originalPosition: 5,
          currentPosition: 7,
        },
      );

      spyOn(service, 'displaySuccessNotification');
      service.selectBitstreamEntry(entry);
      service.clearSelection();

      expect(service.displaySuccessNotification).toHaveBeenCalled();
    });

    it('should not display a notification if the selected bitstream is in its original position', () => {
      const entry = Object.assign({}, defaultEntry,
        {
          originalPosition: 7,
          currentPosition: 7,
        },
      );

      spyOn(service, 'displaySuccessNotification');
      service.selectBitstreamEntry(entry);
      service.clearSelection();

      expect(service.displaySuccessNotification).not.toHaveBeenCalled();
    });
  });

  describe('cancelSelection', () => {
    it('should clear the selected bitstream if it has not moved', fakeAsync(() => {
      const emittedActions = [];

      service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();

      const entry = Object.assign({}, defaultEntry);

      service.selectBitstreamEntry(entry);
      tick();

      expect(emittedActions.length).toBe(2);
      expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });

      service.cancelSelection();
      tick();

      expect(emittedActions.length).toBe(3);
      expect(emittedActions[2]).toEqual({ action: 'Cleared', selectedEntry: entry });
    }));

    it('should cancel the selected bitstream if it has moved', fakeAsync(() => {
      const emittedActions = [];

      service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeNull();

      const entry = Object.assign({}, defaultEntry, {
        originalPosition: 0,
        currentPosition: 3,
      });

      service.selectBitstreamEntry(entry);
      tick();

      expect(emittedActions.length).toBe(2);
      expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });

      service.cancelSelection();
      tick();

      expect(emittedActions.length).toBe(3);
      expect(emittedActions[2]).toEqual({ action: 'Cancelled', selectedEntry: entry });
    }));

    it('should announce a clear if the bitstream has not moved', () => {
      const entry = Object.assign({}, defaultEntry,
        {
          originalPosition: 7,
          currentPosition: 7,
        },
      );

      spyOn(service, 'announceClear');
      spyOn(service, 'announceCancel');

      service.selectBitstreamEntry(entry);
      service.cancelSelection();

      expect(service.announceClear).toHaveBeenCalledWith(entry.bitstream.name);
      expect(service.announceCancel).not.toHaveBeenCalled();
    });

    it('should announce a cancel if the bitstream has moved', () => {
      const entry = Object.assign({}, defaultEntry,
        {
          originalPosition: 5,
          currentPosition: 7,
        },
      );

      spyOn(service, 'announceClear');
      spyOn(service, 'announceCancel');

      service.selectBitstreamEntry(entry);
      service.cancelSelection();

      expect(service.announceClear).not.toHaveBeenCalled();
      expect(service.announceCancel).toHaveBeenCalledWith(entry.bitstream.name, entry.originalPosition);
    });

    it('should return the bitstream to its original position if it has moved', () => {
      const entry = Object.assign({}, defaultEntry,
        {
          originalPosition: 5,
          currentPosition: 7,
        },
      );

      spyOn(service, 'performBitstreamMoveRequest');

      service.selectBitstreamEntry(entry);
      service.cancelSelection();

      expect(service.performBitstreamMoveRequest).toHaveBeenCalledWith(entry.bundle, entry.currentPosition, entry.originalPosition);
    });

    it('should not move the bitstream if it has not moved', () => {
      const entry = Object.assign({}, defaultEntry,
        {
          originalPosition: 7,
          currentPosition: 7,
        },
      );

      spyOn(service, 'performBitstreamMoveRequest');

      service.selectBitstreamEntry(entry);
      service.cancelSelection();

      expect(service.performBitstreamMoveRequest).not.toHaveBeenCalled();
    });

    it('should not do anything if there is no selected bitstream', () => {
      spyOn(service, 'announceClear');
      spyOn(service, 'announceCancel');
      spyOn(service, 'performBitstreamMoveRequest');

      service.cancelSelection();

      expect(service.announceClear).not.toHaveBeenCalled();
      expect(service.announceCancel).not.toHaveBeenCalled();
      expect(service.performBitstreamMoveRequest).not.toHaveBeenCalled();
    });
  });

  describe('moveSelectedBitstream', () => {
    beforeEach(() => {
      spyOn(service, 'performBitstreamMoveRequest').and.callThrough();
    });

    describe('up', () => {
      it('should move the selected bitstream one position up', () => {
        const startPosition = 7;
        const endPosition = startPosition - 1;

        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: startPosition,
          },
        );

        const movedEntry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: endPosition,
          },
        );

        service.selectBitstreamEntry(entry);
        service.moveSelectedBitstreamUp();
        expect(service.performBitstreamMoveRequest).toHaveBeenCalledWith(entry.bundle, startPosition, endPosition, jasmine.any(Function));
        expect(service.getSelectedBitstream()).toEqual(movedEntry);
      });

      it('should emit the move', fakeAsync(() => {
        const emittedActions = [];

        service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

        expect(emittedActions.length).toBe(1);
        expect(emittedActions[0]).toBeNull();

        const startPosition = 7;
        const endPosition = startPosition - 1;

        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: startPosition,
          },
        );

        const movedEntry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: endPosition,
          },
        );

        service.selectBitstreamEntry(entry);
        tick();

        expect(emittedActions.length).toBe(2);
        expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });

        service.moveSelectedBitstreamUp();
        tick();

        expect(emittedActions.length).toBe(3);
        expect(emittedActions[2]).toEqual({ action: 'Moved', selectedEntry: movedEntry });
      }));

      it('should announce the move', () => {
        const startPosition = 7;
        const endPosition = startPosition - 1;

        spyOn(service, 'announceMove');

        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: startPosition,
          },
        );

        service.selectBitstreamEntry(entry);
        service.moveSelectedBitstreamUp();

        expect(service.announceMove).toHaveBeenCalledWith(entry.bitstream.name, endPosition);
      });

      it('should not do anything if the bitstream is already at the top', () => {
        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: 0,
          },
        );

        service.selectBitstreamEntry(entry);
        service.moveSelectedBitstreamUp();

        expect(service.performBitstreamMoveRequest).not.toHaveBeenCalled();
      });

      it('should not do anything if there is no selected bitstream', () => {
        service.moveSelectedBitstreamUp();

        expect(service.performBitstreamMoveRequest).not.toHaveBeenCalled();
      });
    });

    describe('down', () => {
      it('should move the selected bitstream one position down', () => {
        const startPosition = 7;
        const endPosition = startPosition + 1;

        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: startPosition,
          },
        );

        const movedEntry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: endPosition,
          },
        );

        service.selectBitstreamEntry(entry);
        service.moveSelectedBitstreamDown();
        expect(service.performBitstreamMoveRequest).toHaveBeenCalledWith(entry.bundle, startPosition, endPosition, jasmine.any(Function));
        expect(service.getSelectedBitstream()).toEqual(movedEntry);
      });

      it('should emit the move', fakeAsync(() => {
        const emittedActions = [];

        service.getSelectionAction$().subscribe(selected => emittedActions.push(selected));

        expect(emittedActions.length).toBe(1);
        expect(emittedActions[0]).toBeNull();

        const startPosition = 7;
        const endPosition = startPosition + 1;

        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: startPosition,
          },
        );

        const movedEntry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: endPosition,
          },
        );

        service.selectBitstreamEntry(entry);
        tick();

        expect(emittedActions.length).toBe(2);
        expect(emittedActions[1]).toEqual({ action: 'Selected', selectedEntry: entry });

        service.moveSelectedBitstreamDown();
        tick();

        expect(emittedActions.length).toBe(3);
        expect(emittedActions[2]).toEqual({ action: 'Moved', selectedEntry: movedEntry });
      }));

      it('should announce the move', () => {
        const startPosition = 7;
        const endPosition = startPosition + 1;

        spyOn(service, 'announceMove');

        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: startPosition,
          },
        );

        service.selectBitstreamEntry(entry);
        service.moveSelectedBitstreamDown();

        expect(service.announceMove).toHaveBeenCalledWith(entry.bitstream.name, endPosition);
      });

      it('should not do anything if the bitstream is already at the bottom of the bundle', () => {
        const entry = Object.assign({}, defaultEntry,
          {
            originalPosition: 5,
            currentPosition: 9,
          },
        );

        service.selectBitstreamEntry(entry);
        service.moveSelectedBitstreamDown();

        expect(service.performBitstreamMoveRequest).not.toHaveBeenCalled();
      });

      it('should not do anything if there is no selected bitstream', () => {
        service.moveSelectedBitstreamDown();

        expect(service.performBitstreamMoveRequest).not.toHaveBeenCalled();
      });
    });
  });

  describe('performBitstreamMoveRequest', () => {
    const bundle: Bundle = defaultEntry.bundle;
    const from = 5;
    const to = 7;
    const callback = createSpy('callbackFunction');

    it('should correctly create the Move request', () => {
      const expectedOperation: MoveOperation = {
        op: 'move',
        from: `/_links/bitstreams/${from}/href`,
        path: `/_links/bitstreams/${to}/href`,
      };

      service.performBitstreamMoveRequest(bundle, from, to, callback);
      expect(bundleDataService.patch).toHaveBeenCalledWith(bundle, [expectedOperation]);
    });

    it('should correctly make the bundle\'s self link stale', () => {
      service.performBitstreamMoveRequest(bundle, from, to, callback);
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(bundle._links.self.href);
    });

    it('should attempt to show a message should the request have failed', () => {
      spyOn(service, 'displayFailedResponseNotifications');
      service.performBitstreamMoveRequest(bundle, from, to, callback);
      expect(service.displayFailedResponseNotifications).toHaveBeenCalled();
    });

    it('should correctly call the provided function once the request has finished', () => {
      service.performBitstreamMoveRequest(bundle, from, to, callback);
      expect(callback).toHaveBeenCalled();
    });

    it('should emit at the start and end of the request', fakeAsync(() => {
      const emittedActions = [];

      service.getPerformingMoveRequest$().subscribe(selected => emittedActions.push(selected));

      expect(emittedActions.length).toBe(1);
      expect(emittedActions[0]).toBeFalse();

      service.performBitstreamMoveRequest(bundle, from, to, callback);
      tick();

      expect(emittedActions.length).toBe(3);
      expect(emittedActions[1]).toBeTrue();
      expect(emittedActions[2]).toBeFalse();
    }));
  });

  describe('displayNotifications', () => {
    it('should display an error notification if a response failed', () => {
      const responses = [
        createFailedRemoteDataObject(),
      ];

      const key = 'some.key';

      service.displayNotifications(key, responses);

      expect(notificationsService.success).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
      expect(translateService.instant).toHaveBeenCalledWith('some.key.failed.title');
    });

    it('should display a success notification if a response succeeded', () => {
      const responses = [
        createSuccessfulRemoteDataObject(undefined),
      ];

      const key = 'some.key';

      service.displayNotifications(key, responses);

      expect(notificationsService.success).toHaveBeenCalled();
      expect(notificationsService.error).not.toHaveBeenCalled();
      expect(translateService.instant).toHaveBeenCalledWith('some.key.saved.title');
    });

    it('should display both notifications if some failed and some succeeded', () => {
      const responses = [
        createFailedRemoteDataObject(),
        createSuccessfulRemoteDataObject(undefined),
      ];

      const key = 'some.key';

      service.displayNotifications(key, responses);

      expect(notificationsService.success).toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
      expect(translateService.instant).toHaveBeenCalledWith('some.key.saved.title');
      expect(translateService.instant).toHaveBeenCalledWith('some.key.saved.title');
    });
  });

  describe('mapBitstreamsToTableEntries', () => {
    it('should correctly map a Bitstream to a BitstreamTableEntry', () => {
      const format: BitstreamFormat = new BitstreamFormat();

      const bitstream: Bitstream = Object.assign(new Bitstream(), {
        uuid: 'testUUID',
        format: createSuccessfulRemoteDataObject$(format),
      });

      spyOn(dsoNameService, 'getName').and.returnValue('Test Name');
      spyOn(bitstream, 'firstMetadataValue').and.returnValue('description');

      const tableEntry = service.mapBitstreamsToTableEntries([bitstream])[0];

      expect(tableEntry.name).toEqual('Test Name');
      expect(tableEntry.nameStripped).toEqual('TestName');
      expect(tableEntry.bitstream).toBe(bitstream);
      expect(tableEntry.id).toEqual('testUUID');
      expect(tableEntry.description).toEqual('description');
      expect(tableEntry.downloadUrl).toEqual('/bitstreams/testUUID/download');
    });
  });

  describe('nameToHeader', () => {
    it('should correctly transform a string to an appropriate header ID', () => {
      const stringA = 'Test String';
      const stringAResult = 'TestString';
      expect(service.nameToHeader(stringA)).toEqual(stringAResult);

      const stringB = 'Test String Two';
      const stringBResult = 'TestStringTwo';
      expect(service.nameToHeader(stringB)).toEqual(stringBResult);

      const stringC = 'Test           String           Three';
      const stringCResult = 'TestStringThree';
      expect(service.nameToHeader(stringC)).toEqual(stringCResult);
    });
  });

});
