import { ItemBitstreamsService } from './item-bitstreams.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { ObjectUpdatesServiceStub } from '../../../core/data/object-updates/object-updates.service.stub';
import { BitstreamDataServiceStub } from '../../../shared/testing/bitstream-data-service.stub';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../../core/shared/bitstream-format.model';
import {
  createSuccessfulRemoteDataObject$,
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject
} from '../../../shared/remote-data.utils';

describe('ItemBitstreamsService', () => {
  let service: ItemBitstreamsService;
  let notificationsService: NotificationsService;
  let translateService: TranslateService;
  let objectUpdatesService: ObjectUpdatesService;
  let bitstreamDataService: BitstreamDataService;
  let dsoNameService: DSONameService;

  beforeEach(() => {
    notificationsService = new NotificationsServiceStub() as any;
    translateService = getMockTranslateService();
    objectUpdatesService = new ObjectUpdatesServiceStub() as any;
    bitstreamDataService = new BitstreamDataServiceStub() as any;
    dsoNameService = new DSONameServiceMock() as any;

    service = new ItemBitstreamsService(
      notificationsService,
      translateService,
      objectUpdatesService,
      bitstreamDataService,
      dsoNameService,
    );
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
