/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { AppConfig } from '@dspace/config/app-config.interface';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { BitstreamFormatDataService } from '@dspace/core/data/bitstream-format-data.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';

import { PdfViewerService } from './pdf-viewer-service';

describe('PdfViewerService', () => {
  let service: PdfViewerService;

  let bitstreamFormatService: BitstreamFormatDataService;
  let linkService: LinkService;

  let appConfig: AppConfig;

  beforeEach(() => {
    appConfig = { pdfViewer: { enabled: true } } as AppConfig;

    bitstreamFormatService = jasmine.createSpyObj('bitstreamFormatDataService', {
      findByBitstream: createSuccessfulRemoteDataObject$({ mimetype: 'application/pdf' } as BitstreamFormat),
    });
    linkService = jasmine.createSpyObj('linkService', [
      'resolveLinkWithoutAttaching',
    ]);

    service = new PdfViewerService(
      bitstreamFormatService,
      linkService,
      appConfig,
    );
  });

  describe('viewerAllowedForBitstreamFormat$', () => {
    let dso: DSpaceObject;

    it('should return true if the dso is not a bitstream', (done) => {
      dso = new Item();

      service.viewerAllowedForBitstreamFormat$(dso).subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should call BitstreamFormatDataService if the dso is a bitstream', (done) => {
      dso = new Bitstream();

      service.viewerAllowedForBitstreamFormat$(dso).subscribe((result: boolean) => {
        expect(bitstreamFormatService.findByBitstream).toHaveBeenCalled();
        done();
      });
    });

    it('should call return true if the bitstream format is PDF', (done) => {
      dso = new Bitstream();

      service.viewerAllowedForBitstreamFormat$(dso).subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should call return false if the bitstream format is not PDF', (done) => {
      dso = new Bitstream();
      (bitstreamFormatService.findByBitstream as jasmine.Spy).and.returnValue(
        createSuccessfulRemoteDataObject$({ mimetype: 'text/plain' } as BitstreamFormat),
      );

      service.viewerAllowedForBitstreamFormat$(dso).subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });
  });

  describe('isViewerEnabled$', () => {
    let dso: DSpaceObject;
    let parentDso: DSpaceObject = new DSpaceObject();

    beforeEach(() => {
      (linkService.resolveLinkWithoutAttaching as jasmine.Spy).and.returnValue(
        createSuccessfulRemoteDataObject$(parentDso),
      );
    });

    it('should return pdfViewer.enabled value if the dso is empty', (done) => {
      dso = new Bitstream();

      service.isViewerEnabled$(dso).subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });

      appConfig.pdfViewer.enabled = false;
      service.isViewerEnabled$(dso).subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should return true if parent metadata value and pdfViewer.enabled are both true', (done) => {
      dso = new Bitstream();

      spyOn(parentDso, 'firstMetadataValue').and.returnValue('true');
      service.isViewerEnabled$(dso).subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });

      (parentDso.firstMetadataValue as jasmine.Spy).and.returnValue('false');
      service.isViewerEnabled$(dso).subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });

      (parentDso.firstMetadataValue as jasmine.Spy).and.returnValue('true');
      appConfig.pdfViewer.enabled = false;service.isViewerEnabled$(dso).subscribe((result: boolean) => {
        expect(result).toBeFalse();
        done();
      });
    });
  });
});
