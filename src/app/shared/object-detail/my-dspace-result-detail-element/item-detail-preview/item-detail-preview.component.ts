import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Bitstream,
  BitstreamDataService,
  Context,
  DSONameService,
  FileService,
  getFirstSucceededRemoteListPayload,
  HALEndpointService,
  Item,
  SearchResult,
} from '@dspace/core';
import { hasValue } from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ThemedItemPageTitleFieldComponent } from '../../../../item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { fadeInOut } from '../../../animations/fade';
import { MetadataFieldWrapperComponent } from '../../../metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedBadgesComponent } from '../../../object-collection/shared/badges/themed-badges.component';
import { ItemSubmitterComponent } from '../../../object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { FileSizePipe } from '../../../utils/file-size-pipe';
import { VarDirective } from '../../../utils/var.directive';
import { ThemedItemDetailPreviewFieldComponent } from './item-detail-preview-field/themed-item-detail-preview-field.component';

/**
 * This component show metadata for the given item object in the detail view.
 */
@Component({
  selector: 'ds-item-detail-preview',
  styleUrls: ['./item-detail-preview.component.scss'],
  templateUrl: './item-detail-preview.component.html',
  animations: [fadeInOut],
  standalone: true,
  imports: [ThemedBadgesComponent, ThemedItemPageTitleFieldComponent, MetadataFieldWrapperComponent, ThemedThumbnailComponent, VarDirective, ThemedItemDetailPreviewFieldComponent, ItemSubmitterComponent, AsyncPipe, FileSizePipe, TranslateModule],
})
export class ItemDetailPreviewComponent implements OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (hasValue(changes.item)) {
      this.bitstreams$ = this.getFiles();
    }
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
        getFirstSucceededRemoteListPayload(),
      );
  }
}
