import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '@dspace/core/shared/bitstream-format-support-level';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValueFilter } from '@dspace/core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { EditBitstreamPageAlertsComponent } from './edit-bitstream-page-alerts.component';

let bitstreamService: BitstreamDataService;
let bitstream: Bitstream;
let bitstreamID: string;
let selectedFormat: BitstreamFormat;
let allFormats: BitstreamFormat[];
let bundle;
let comp: EditBitstreamPageAlertsComponent;
let fixture: ComponentFixture<EditBitstreamPageAlertsComponent>;

describe('EditBitstreamPageAlertsComponent', () => {

  beforeEach(() => {
    bitstreamID = 'current-bitstream-id';
    allFormats = [
      Object.assign({
        id: '1',
        shortDescription: 'Unknown',
        description: 'Unknown format',
        supportLevel: BitstreamFormatSupportLevel.Unknown,
        mimetype: 'application/octet-stream',
        _links: {
          self: { href: 'format-selflink-1' },
        },
      }),
      Object.assign({
        id: '2',
        shortDescription: 'PNG',
        description: 'Portable Network Graphics',
        supportLevel: BitstreamFormatSupportLevel.Known,
        mimetype: 'image/png',
        _links: {
          self: { href: 'format-selflink-2' },
        },
      }),
      Object.assign({
        id: '3',
        shortDescription: 'GIF',
        description: 'Graphics Interchange Format',
        supportLevel: BitstreamFormatSupportLevel.Known,
        mimetype: 'image/gif',
        _links: {
          self: { href: 'format-selflink-3' },
        },
      }),
    ] as BitstreamFormat[];
    selectedFormat = allFormats[1];

    bundle = {
      _links: {
        primaryBitstream: {
          href: 'bundle-selflink',
        },
      },
      item: createSuccessfulRemoteDataObject$(Object.assign(new Item(), {
        uuid: 'some-uuid',
        firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
          return undefined;
        },
      })),
    };
  });

  describe('when the bitstream has no replacement reference metadata', () => {
    beforeEach(waitForAsync(() => {
      bundle = {
        _links: {
          primaryBitstream: {
            href: 'bundle-selflink',
          },
        },
        item: createSuccessfulRemoteDataObject$(Object.assign(new Item(), {
          uuid: 'some-uuid',
          firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
            return undefined;
          },
        })),
      };
      bitstream = Object.assign(new Bitstream(), {
        uuid: bitstreamID,
        id: bitstreamID,
        metadata: {
          'dc.description': [
            {
              value: 'Bitstream description',
            },
          ],
          'dc.title': [
            {
              value: 'Bitstream title',
            },
          ],
        },
        format: createSuccessfulRemoteDataObject$(selectedFormat),
        _links: {
          self: 'bitstream-selflink',
        },
        bundle: createSuccessfulRemoteDataObject$(bundle),
      });
      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findById: createSuccessfulRemoteDataObject$(bitstream),
        findByHref: createSuccessfulRemoteDataObject$(bitstream),
        update: createSuccessfulRemoteDataObject$(bitstream),
        updateFormat: createSuccessfulRemoteDataObject$(bitstream),
        commitUpdates: {},
        patch: {},
      });

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule, EditBitstreamPageAlertsComponent, FileSizePipe, VarDirective],
        providers: [
          { provide: BitstreamDataService, useValue: bitstreamService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(EditBitstreamPageAlertsComponent);
      comp = fixture.componentInstance;
      comp.bitstream = bitstream;
      fixture.detectChanges();
    });

    it('no alert should be shown', () => {
      const alert = fixture.debugElement.query(By.css('.alert-info'));
      expect(alert).toBeFalsy();
    });
  });

  describe('when the bitstream has has two replacement reference values', () => {
    beforeEach(waitForAsync(() => {
      bundle = {
        _links: {
          primaryBitstream: {
            href: 'bundle-selflink',
          },
        },
        item: createSuccessfulRemoteDataObject$(Object.assign(new Item(), {
          uuid: 'some-uuid',
          firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
            return undefined;
          },
        })),
      };
      bitstream = Object.assign(new Bitstream(), {
        uuid: bitstreamID,
        id: bitstreamID,
        metadata: {
          'dc.description': [
            {
              value: 'Bitstream description',
            },
          ],
          'dc.title': [
            {
              value: 'Bitstream title',
            },
          ],
          'dspace.bitstream.isCopyOf': [
            {
              value: 'Related Bitstream title 1',
              authority: 'related-uuid1',
            },
          ],
          'dspace.bitstream.isReplacedBy': [
            {
              value: 'Related Bitstream title 2',
              authority: 'related-uuid2',
            },
          ],
        },
        format: createSuccessfulRemoteDataObject$(selectedFormat),
        _links: {
          self: 'bitstream-selflink',
        },
        bundle: createSuccessfulRemoteDataObject$(bundle),
      });
      const relatedBitstream1 = Object.assign(new Bitstream(), {
        uuid: 'related-uuid1',
        id: 'related-uuid1',
        metadata: {
          'dc.description': [
            {
              value: 'Bitstream description',
            },
          ],
          'dc.title': [
            {
              value: 'Related Bitstream title 1',
            },
          ],
        },
        format: createSuccessfulRemoteDataObject$(selectedFormat),
        _links: {
          self: 'bitstream-selflink',
        },
        bundle: createSuccessfulRemoteDataObject$(bundle),
      });
      const relatedBitstream2 = Object.assign(new Bitstream(), {
        uuid: 'related-uuid2',
        id: 'related-uuid2',
        metadata: {
          'dc.description': [
            {
              value: 'Bitstream description',
            },
          ],
          'dc.title': [
            {
              value: 'Related Bitstream title 2',
            },
          ],
        },
        format: createSuccessfulRemoteDataObject$(selectedFormat),
        _links: {
          self: 'bitstream-selflink',
        },
        bundle: createSuccessfulRemoteDataObject$(bundle),
      });
      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findById: createSuccessfulRemoteDataObject$(bitstream),
        findByHref: createSuccessfulRemoteDataObject$(bitstream),
        update: createSuccessfulRemoteDataObject$(bitstream),
        updateFormat: createSuccessfulRemoteDataObject$(bitstream),
        commitUpdates: {},
        patch: {},
      });
      (bitstreamService as any).findById.and.callFake((id: string) => {
        if (id === 'related-uuid1') {
          return createSuccessfulRemoteDataObject$(relatedBitstream1);
        } else if (id === 'related-uuid2') {
          return createSuccessfulRemoteDataObject$(relatedBitstream2);
        }
      });
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule, EditBitstreamPageAlertsComponent, FileSizePipe, VarDirective],
        providers: [
          { provide: BitstreamDataService, useValue: bitstreamService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(EditBitstreamPageAlertsComponent);
      comp = fixture.componentInstance;
      comp.bitstream = bitstream;
      fixture.detectChanges();
    });

    it('both values should be shown in an alert, only one as link', () => {
      fixture.detectChanges();

      const links = fixture.debugElement.queryAll(By.css('.alert-info a'));
      expect(links).toBeTruthy();
      expect(links.length).toBe(2);
      expect(links[0].nativeElement.textContent).toContain('Related Bitstream title 1');
      expect(links[0].nativeElement.href).toContain('related-uuid1');
      expect(links[1].nativeElement.textContent).toContain('Related Bitstream title 2');
      expect(links[1].nativeElement.href).toContain('related-uuid2');
    });
  });

});
