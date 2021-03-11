import { ItemExportFormatMolteplicity, ItemExportFormatService } from './item-export-format.service';
import { of } from 'rxjs';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { PaginatedList } from '../data/paginated-list.model';
import { ItemExportFormat } from './model/item-export-format.model';
import { ItemExportFormatsMap } from '../../shared/item-export/item-export.service.spec';
import { RequestParam } from '../cache/models/request-param.model';
import { Process } from '../../process-page/processes/process.model';
import createSpyObj = jasmine.createSpyObj;
import { EventEmitter } from '@angular/core';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import {
  BULK_ITEM_EXPORT_SCRIPT_NAME,
  ITEM_EXPORT_SCRIPT_NAME,
  ScriptDataService
} from '../data/processes/script-data.service';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { SearchFilter } from '../../shared/search/search-filter.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';

describe('ItemExportFormatService', () => {

  let service: ItemExportFormatService;
  const notificationsService: NotificationsService = new NotificationsServiceStub() as any;
  const translateService: TranslateService = {
    get: () => of('test-message'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  } as any;
  let scriptDataService: ScriptDataService;
  const TheProcess = Object.assign(new Process(), {
    resourceSelfLinks: ['process/1234']
  });

  beforeEach(() => {
    scriptDataService = createSpyObj('scriptDataService', ['invoke']);
    service = new ItemExportFormatService(
      null,
      null,
      null,
      null,
      null,
      notificationsService,
      null,
      null,
      null,
      translateService,
      scriptDataService);
  });

  describe('byEntityTypeAndMolteplicity', () => {

    beforeEach(() => {
      const searchResult: any = [...ItemExportFormatsMap.Publication, ...ItemExportFormatsMap.Project];
      const paginatedList: PaginatedList<ItemExportFormat> = createPaginatedList(searchResult);
      spyOn(service.dataService, 'searchBy').and.returnValue(createSuccessfulRemoteDataObject$(paginatedList));
    });

    it('should configure and call dataService.searchBy and map results by entityType', (done) => {
      const entityTypeId = 'Publication';
      const molteplicity = ItemExportFormatMolteplicity.MULTIPLE;

      const searchParams = [
        new RequestParam('molteplicity', molteplicity),
        new RequestParam('entityTypeId', entityTypeId)
      ];

      service.byEntityTypeAndMolteplicity(entityTypeId, molteplicity).subscribe((result) => {
        expect(service.dataService.searchBy).toHaveBeenCalledWith('byEntityTypeAndMolteplicity', { searchParams, elementsPerPage: 100 });
        expect(result).toEqual(ItemExportFormatsMap);
        done();
      });

      expect(service).toBeTruthy();
    });

  });

  describe('doExport', () => {

    beforeEach(() => {
      (scriptDataService as any).invoke.and.returnValue(createSuccessfulRemoteDataObject$(TheProcess));
    });

    it('should invoke a configured single item export', (done) => {
      const format = Object.assign(new ItemExportFormat(), { id: 'publication-xml'});
      const uuid = 'itemUUID';
      const expectedParameters = [
        Object.assign(new ProcessParameter(), { name: '-i', value: 'itemUUID' }),
        Object.assign(new ProcessParameter(), { name: '-f', value: 'publication-xml' }),
      ];
      service.doExport(uuid, format).subscribe((result) => {
        expect(result).toEqual(1234);
        expect((service as any).scriptDataService.invoke).toHaveBeenCalledWith(ITEM_EXPORT_SCRIPT_NAME, expectedParameters, []);
        done();
      });

    });

  });

  describe('doExportMulti', () => {

    beforeEach(() => {
      (scriptDataService as any).invoke.and.returnValue(createSuccessfulRemoteDataObject$(TheProcess));
    });

    it('should invoke a configured bulk item export', (done) => {
      const entityType = 'Publication';
      const format = Object.assign(new ItemExportFormat(), { id: 'publication-xml'});
      const searchOptions = new PaginatedSearchOptions({
        query: 'queryX',
        filters: [
          new SearchFilter('f.name', ['nameX']),
          new SearchFilter('f.type', ['typeX']),
          new SearchFilter('other.name', ['nameY'])
        ],
        fixedFilter: 'scope=scopeX',
        configuration: 'configurationX',
        sort: new SortOptions('fieldX', SortDirection.ASC)
      });

      const expectedParameters = [
        Object.assign(new ProcessParameter(), { name: '-t', value: 'Publication' }),
        Object.assign(new ProcessParameter(), { name: '-f', value: 'publication-xml' }),
        Object.assign(new ProcessParameter(), { name: '-q', value: 'queryX' }),
        Object.assign(new ProcessParameter(), { name: '-sf', value: 'name=nameX&type=typeX' }),
        Object.assign(new ProcessParameter(), { name: '-s', value: 'scopeX' }),
        Object.assign(new ProcessParameter(), { name: '-c', value: 'configurationX' }),
        Object.assign(new ProcessParameter(), { name: '-so', value: 'fieldX,ASC' }),
      ];

      service.doExportMulti(entityType, format, searchOptions).subscribe((result) => {
        expect(result).toEqual(1234);
        expect((service as any).scriptDataService.invoke).toHaveBeenCalledWith(BULK_ITEM_EXPORT_SCRIPT_NAME, expectedParameters, []);
        done();
      });

    });

  });

});
