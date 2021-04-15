import { ItemExportService } from '../../shared/item-export/item-export.service';
import {
  ItemExportFormatMolteplicity,
  ItemExportFormatService
} from '../../core/itemexportformat/item-export-format.service';
import { Item } from '../../core/shared/item.model';
import { ItemExportFormat } from '../../core/itemexportformat/model/item-export-format.model';
import { of } from 'rxjs';


const ThePublication = Object.assign(new Item(), {
  uuid: 'ThePublicationUUID',
  metadata: {
    'dc.title': [ { value: 'A Title' }],
    'dspace.entity.type': [ { value: 'Publication' }],
  }
});

export const ItemExportFormatsMap: { [entityType: string]: ItemExportFormat[] } = {
  'Publication': [
    Object.assign(new ItemExportFormat(), { id: 'publication-xml', entityType: 'Publication'}),
    Object.assign(new ItemExportFormat(), { id: 'publication-json', entityType: 'Publication'}),
  ],
  'Project': [
    Object.assign(new ItemExportFormat(), { id: 'project-xml', entityType: 'Project'})
  ]
};

describe('ItemExportService', () => {

  let service: ItemExportService;
  let itemExportFormatService: ItemExportFormatService;

  beforeEach(() => {
    itemExportFormatService = jasmine.createSpyObj('itemExportFormatService',
      ['byEntityTypeAndMolteplicity', 'doExport', 'doExportMulti']);
    service = new ItemExportService(itemExportFormatService);
  });

  describe('initialItemExportFormConfiguration', () => {

    beforeEach(() => {
      (itemExportFormatService.byEntityTypeAndMolteplicity as any).and.returnValue(of(ItemExportFormatsMap));
    });

    describe('when an item is passed', () => {
      it('should return the export single configuration', (done) => {
        const expectedEntityType = 'Publication';
        const expectedFormats = ItemExportFormatsMap[expectedEntityType];

        service.initialItemExportFormConfiguration(ThePublication).subscribe((configuration) => {
          expect(configuration.entityTypes).toEqual(null);
          expect(configuration.entityType).toEqual(expectedEntityType);
          expect(configuration.formats).toEqual(expectedFormats);
          expect(configuration.format).toEqual(expectedFormats[0]);
          done();
        });

      });
    });

    describe('when no item are passed ', () => {
      it('should return the export multiple configuration', (done) => {

        const expectedEntityTypes = Object.keys(ItemExportFormatsMap);

        service.initialItemExportFormConfiguration(null).subscribe((configuration) => {
          expect(configuration.entityTypes).toEqual(expectedEntityTypes);
          expect(configuration.entityType).toEqual(null);
          expect(configuration.formats).toEqual([]);
          expect(configuration.format).toEqual(null);
          done();
        });

      });
    });

  });

  describe('onSelectEntityType', () => {

    beforeEach(() => {
      (itemExportFormatService.byEntityTypeAndMolteplicity as any).and.returnValue(of(ItemExportFormatsMap));
    });


    it('should return the export multiple configuration with the entityType selected', (done) => {

      const availableEntityTypes = Object.keys(ItemExportFormatsMap);
      const selectedEntityType = 'Project';
      const expectedFormats = ItemExportFormatsMap[selectedEntityType];

      service.onSelectEntityType(availableEntityTypes, selectedEntityType).subscribe((configuration) => {
        expect(configuration.entityTypes).toEqual(availableEntityTypes);
        expect(configuration.entityType).toEqual(selectedEntityType);
        expect(configuration.formats).toEqual(expectedFormats);
        expect(configuration.format).toEqual(expectedFormats[0]);
        done();
      });

    });
  });

  describe('submitForm', () => {

    beforeEach(() => {
      (itemExportFormatService.doExport as any).and.returnValue(of(1111));
      (itemExportFormatService.doExportMulti as any).and.returnValue(of(2222));
    });

    describe('when single export', () => {
      it('should invoke doExport and return the processNumber', (done) => {
        const selectedFormat = ItemExportFormatsMap.Publication[0];

        service.submitForm(ItemExportFormatMolteplicity.SINGLE, ThePublication, null, null, selectedFormat).subscribe((processNumber) => {
          expect(itemExportFormatService.doExport).toHaveBeenCalledWith('ThePublicationUUID', selectedFormat);
          expect(itemExportFormatService.doExportMulti).not.toHaveBeenCalled();
          expect(processNumber).toEqual(1111);
          done();
        });
      });
    });

    describe('when bulk export', () => {
      it('should invoke doExportMulti and return the processNumber', (done) => {
        const selectedFormat = ItemExportFormatsMap.Publication[0];
        const selectedEntityType = 'Publication';
        const searchOptions: any = 'searchOptions';

        service.submitForm(ItemExportFormatMolteplicity.MULTIPLE, null, searchOptions, selectedEntityType, selectedFormat).subscribe((processNumber) => {
          expect(itemExportFormatService.doExport).not.toHaveBeenCalled();
          expect(itemExportFormatService.doExportMulti).toHaveBeenCalledWith(selectedEntityType, selectedFormat, searchOptions);
          expect(processNumber).toEqual(2222);
          done();
        });

      });
    });

  });

});
