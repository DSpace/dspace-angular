import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EMPTY,
  switchMap,
  tap,
} from 'rxjs';
import {
  map,
  filter,
  take,
} from 'rxjs/operators';

import { Context } from '../../../../../../../../../app/core/shared/context.model';
import { ViewMode } from '../../../../../../../../../app/core/shared/view-mode.model';
import { BitstreamDataService } from '../../../../../../../../../app/core/data/bitstream-data.service';
import { PaginatedList } from '../../../../../../../../../app/core/data/paginated-list.model';
import { Bitstream } from '../../../../../../../../../app/core/shared/bitstream.model';
import { BitstreamFormat } from '../../../../../../../../../app/core/shared/bitstream-format.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../../../../app/core/shared/operators';
import { followLink } from '../../../../../../../../../app/shared/utils/follow-link-config.model';
import { ThemedBadgesComponent } from '../../../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { ItemSearchResult } from '../../../../../../../../../app/shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent as BaseComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableComponent } from '../../../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../../../../../app/thumbnail/themed-thumbnail.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.Any, 'custom')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.Any, 'custom')
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemSearchResultListElementComponent extends BaseComponent implements OnInit {

  private bitstreamService = inject(BitstreamDataService);
  private detectedMime = '';
  private detectedFmt  = '';
  private detectedName = '';

  override ngOnInit(): void {
    super.ngOnInit();
    this.bitstreamService.findAllByItemAndBundleName(
      this.dso, 'ORIGINAL',
      { elementsPerPage: 1 },
      true, true,
      followLink('format'),
    ).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((list: PaginatedList<Bitstream>) => list.page?.[0]),
      filter((bs: Bitstream) => !!bs),
      switchMap((bs: Bitstream) => {
        this.detectedName = bs.name?.toLowerCase() ?? '';
        if (!bs.format) { return EMPTY; }
        return bs.format;
      }),
      getFirstSucceededRemoteDataPayload(),
      take(1),
    ).subscribe((fmt: BitstreamFormat) => {
      this.detectedMime = fmt.mimetype?.toLowerCase() ?? '';
      this.detectedFmt  = fmt.shortDescription?.toLowerCase() ?? '';
    });
  }

  get defaultThumbnail(): string | null {
    const mime = this.detectedMime;
    const fmt  = this.detectedFmt;
    const name = this.detectedName;

    if (!mime && !fmt && !name) { return null; }

    const ext = name.includes('.') ? name.split('.').pop() ?? '' : '';

    if (mime.startsWith('audio/') || ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'flac') {
      return '/assets/custom/images/audio-placeholder.svg';
    }
    if (mime === 'application/pdf' || ext === 'pdf') {
      return '/assets/custom/images/pdf-placeholder.svg';
    }
    if (mime === 'application/msword' ||
        mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        ext === 'doc' || ext === 'docx') {
      return '/assets/custom/images/doc-placeholder.svg';
    }
    if (mime === 'application/vnd.ms-excel' ||
        mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        ext === 'xls' || ext === 'xlsx') {
      return '/assets/custom/images/xls-placeholder.svg';
    }
    if (mime === 'text/plain' || ext === 'txt') {
      return '/assets/custom/images/txt-placeholder.svg';
    }
    if (mime.includes('zip') || fmt.includes('zip') || ext === 'zip') {
      return '/assets/custom/images/zip-placeholder.svg';
    }
    if (mime.startsWith('application/') || mime.startsWith('text/')) {
      return '/assets/custom/images/document-placeholder.svg';
    }

    return null;
  }
}
