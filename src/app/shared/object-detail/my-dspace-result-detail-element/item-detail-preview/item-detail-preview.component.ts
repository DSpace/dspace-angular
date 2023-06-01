import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { Item } from '../../../../core/shared/item.model';
import { getFirstSucceededRemoteListPayload } from '../../../../core/shared/operators';
import { fadeInOut } from '../../../animations/fade';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { FileService } from '../../../../core/shared/file.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SearchResult } from '../../../search/models/search-result.model';
import { Context } from '../../../../core/shared/context.model';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';

/**
 * This component show metadata for the given item object in the detail view.
 */
@Component({
  selector: 'ds-item-detail-preview',
  styleUrls: ['./item-detail-preview.component.scss'],
  templateUrl: './item-detail-preview.component.html',
  animations: [fadeInOut]
})
export class ItemDetailPreviewComponent {
  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * Represents the badge context
   */
  @Input() badgeContext: Context;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * The item's thumbnail
   */
  public bitstreams$: Observable<Bitstream[]>;

  /**
   * The value's separator
   */
  public separator = ', ';

  constructor(
    protected fileService: FileService,
    protected halService: HALEndpointService,
    protected bitstreamDataService: BitstreamDataService,
    public dsoNameService: DSONameService,
  ) {
  }

  /**
   * Perform bitstream download
   */
  public downloadBitstreamFile(uuid: string) {
    this.halService.getEndpoint('bitstreams').pipe(
      first())
      .subscribe((url) => {
        const fileUrl = `${url}/${uuid}/content`;
        this.fileService.retrieveFileDownloadLink(fileUrl);
      });
  }

  // TODO refactor this method to return RemoteData, and the template to deal with loading and errors
  public getFiles(): Observable<Bitstream[]> {
    return this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, 'ORIGINAL', { elementsPerPage: Number.MAX_SAFE_INTEGER })
      .pipe(
        getFirstSucceededRemoteListPayload()
      );
  }
}
