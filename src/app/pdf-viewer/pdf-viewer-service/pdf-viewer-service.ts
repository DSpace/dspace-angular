import { Injectable } from '@angular/core';
import {
  combineLatest,
  EMPTY,
  Observable,
  of,
} from 'rxjs';
import {
  expand,
  filter,
  map,
  toArray,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { LinkService } from '../../core/cache/builders/link.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
} from '../../core/shared/operators';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { followLink } from '../../core/shared/follow-link-config.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to check permissions for PDF viewer
 */
export class PdfViewerService {
  constructor(
    protected bitstreamFormatService: BitstreamFormatDataService,
    protected linkService: LinkService,
  ) {
  }

  /**
   * Is the user allowed to visit the PDF viewer for a given bitstream
   * @param bitstream The bitstream to view
   */
  viewerAllowed(bitstream: Bitstream): Observable<boolean> {
    return combineLatest([this.viewerAllowedForBitstreamFormat(bitstream),
      this.isViewerEnabled(bitstream)]).pipe(
      map(([viewerAllowed, viewerEnabled]) => viewerAllowed && viewerEnabled),
    );
  }

  /**
   * Is the PDF viewer allowed for a given dspace object
   * This will return an observable with true when the dso is not a bitstream and will check to see if the format
   * is a pdf when the dso is a bitstream
   * @param dso The dspace object to check
   */
  viewerAllowedForBitstreamFormat(dso: DSpaceObject): Observable<boolean> {
    if (dso instanceof Bitstream) {
      return this.bitstreamFormatService.findByBitstream(dso).pipe(
        getAllSucceededRemoteDataPayload(),
        map((format) => format.mimetype === 'application/pdf'),
      );
    } else {
      return of(true);
    }
  }

  /**
   * Is the viewer enabled for this dspace object
   * @param dsoToCheck  The dspace object to check
   */
  isViewerEnabled(dsoToCheck: DSpaceObject): Observable<boolean> {
    return of(dsoToCheck).pipe(
      expand((dso: DSpaceObject) => {
        if (hasValue(dso) && typeof (dso as any).firstMetadataValue === 'function' && hasNoValue(dso.firstMetadataValue('dspace.pdfviewer.enabled')) && typeof (dso as any).getParentLinkKey === 'function') {
          const linkName = (dso as any).getParentLinkKey();
          return this.linkService.resolveLinkWithoutAttaching<DSpaceObject, DSpaceObject>(dso, followLink(linkName)).pipe(
            getFirstCompletedRemoteData(),
            map((rd: RemoteData<DSpaceObject>) => {
              if (hasValue(rd.payload)) {
                return rd.payload;
              }
              return null;
            }),
          );
        }
        return EMPTY;
      }),
      filter((dso: DSpaceObject) => hasValue(dso)),
      toArray(),
      map((dsos: DSpaceObject[]) => {
        const dsosWithViewerInfo = dsos.filter((dso) => dso.firstMetadataValue('dspace.pdfviewer.enabled'));
        if (isNotEmpty(dsosWithViewerInfo)) {
          return dsosWithViewerInfo[0].firstMetadataValue('dspace.pdfviewer.enabled') === 'true';
        } else {
          return environment.pdfViewer?.enabled ?? true;
        }
      }),
    );
  }
}
