import {
  AsyncPipe,
  NgFor,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { environment } from '../../../../../../../../environments/environment';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { FindListOptions } from '../../../../../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../shared/file-download-link/themed-file-download-link.component';
import { TruncatableComponent } from '../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../../../../../../../shared/utils/file-size-pipe';
import { BitstreamAttachmentRenderingModelComponent } from './bitstream-attachment-rendering.model';

@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    TruncatableComponent,
    ThemedFileDownloadLinkComponent,
    NgIf,
    TruncatablePartComponent,
    AsyncPipe,
    TitleCasePipe,
    TranslateModule,
    FileSizePipe,
  ],
})
/**
 * The component for displaying a thumbnail rendered metadata box
 */
export class AttachmentComponent extends BitstreamAttachmentRenderingModelComponent implements OnInit {

  /**
   * List of bitstreams to show
   */
  bitstreams$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  /**
   * If the list should show view more button
   */
  canViewMore = false;

  /**
   * Environment variables configuring pagination
   */
  envPagination = environment.attachmentRendering.pagination;

  /**
   * Pagination configuration object
   */
  pageOptions: FindListOptions;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, bitstreamDataService, translateService);
  }

  /**
  * On init check if we want to show the attachment list with pagination or show all attachments
  */
  ngOnInit() {
    this.initPageOptions();
    this.retrieveBitstreams();
  }

  /**
   * Retrieve the list of bitstream to show
   */
  retrieveBitstreams(): void {
    this.getBitstreamsByItem(this.pageOptions).pipe(
      map((bitstreamList: PaginatedList<Bitstream>) => {
        this.canViewMore = this.envPagination.enabled && this.pageOptions?.currentPage !== bitstreamList?.pageInfo?.totalPages;
        return bitstreamList.page;
      }),
      take(1),
    ).subscribe((bitstreams: Bitstream[]) => {
      if (this.envPagination.enabled) {
        this.bitstreams$.next([...this.bitstreams$.value, ...bitstreams]);
      } else {
        this.bitstreams$.next(bitstreams);
      }
    });
  }

  /**
   * When view more is clicked show the next page and check if view more button should be shown
   */
  viewMore() {
    this.pageOptions.currentPage++;
    this.retrieveBitstreams();
  }

  /**
   * Init page option according to configuration
   * @protected
   */
  protected initPageOptions(): void {
    this.pageOptions = Object.assign(new FindListOptions(), {
      elementsPerPage: this.envPagination.enabled ? this.envPagination.elementsPerPage : 100,
      currentPage: 1,
    });
  }
}
