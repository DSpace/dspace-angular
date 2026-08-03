import { TestBed } from '@angular/core/testing';
import { Item } from '@dspace/core/shared/item.model';
import { ITEM } from '@dspace/core/shared/item.resource-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { ItemExportService } from '../../search/item-export/item-export.service';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { ExportItemMenuProvider } from './export-item.menu';

describe('ExportItemMenuProvider', () => {

  const expectedVisibleSection: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'context-menu.actions.export-item.btn',
        disabled: false,
        function: jasmine.any(Function) as any,
      },
      icon: 'file-export',
    },
  ];

  const expectedHiddenSection: PartialMenuSection[] = [
    {
      visible: false,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'context-menu.actions.export-item.btn',
        disabled: false,
        function: jasmine.any(Function) as any,
      },
      icon: 'file-export',
    },
  ];

  let provider: ExportItemMenuProvider;

  const item: Item = Object.assign(new Item(), {
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        value: 'Test Item',
      }],
      'dspace.entity.type': [{
        value: 'Publication',
      }],
    },
  });

  let itemExportService;
  let ngbModal;

  beforeEach(() => {
    itemExportService = jasmine.createSpyObj('ItemExportService', {
      initialItemExportFormConfiguration: of({
        entityType: 'Publication',
        format: { id: 'csv', mimeType: 'text/csv', entityType: 'Publication', molteplicity: 'SINGLE' },
        entityTypes: null,
        formats: [{ id: 'csv', mimeType: 'text/csv', entityType: 'Publication', molteplicity: 'SINGLE' }],
      }),
    });

    ngbModal = jasmine.createSpyObj('NgbModal', {
      open: {
        componentInstance: { molteplicity: null, item: null, showListSelection: null },
      },
    });

    TestBed.configureTestingModule({
      providers: [
        ExportItemMenuProvider,
        { provide: ItemExportService, useValue: itemExportService },
        { provide: NgbModal, useValue: ngbModal },
      ],
    });
    provider = TestBed.inject(ExportItemMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return a visible section when export formats are available', (done) => {
      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedVisibleSection);
        done();
      });
    });

    it('should return a hidden section when no export formats are available', (done) => {
      (itemExportService.initialItemExportFormConfiguration as jasmine.Spy).and.returnValue(of({
        entityType: 'Publication',
        format: null,
        entityTypes: null,
        formats: [],
      }));

      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedHiddenSection);
        done();
      });
    });

    it('should return an empty array when dso is not an Item', (done) => {
      const nonItem = { type: 'community' } as any;
      provider.getSectionsForContext(nonItem).subscribe((sections) => {
        expect(sections).toEqual([]);
        done();
      });
    });
  });

  describe('openExportModal', () => {
    it('should open the ItemExportComponent modal when the section function is called', (done) => {
      provider.getSectionsForContext(item).subscribe((sections) => {
        // Call the onclick function
        (sections[0].model as any).function();
        expect(ngbModal.open).toHaveBeenCalled();
        done();
      });
    });
  });
});
