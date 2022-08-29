import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { environment } from '../../../../../../../../environments/environment';
import { FindListOptions } from '../../../../../../../core/data/request.models';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../../../../core/shared/page-info.model';

@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ATTACHMENT, true)
/**
 * The component for displaying a thumbnail rendered metadata box
 */
export class AttachmentComponent extends BitstreamRenderingModelComponent implements OnInit {

  /**
   * List of all bitstreams that belong to the item
   */
  allBitstreams$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  /**
   * List of bitstreams to show
   */
  bitstreams$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  /**
   * If the list should show view more button
   */
  canViewMore = false;

  /**
   * The current pagination information
   */
  currentPageInfo: PageInfo;

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
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  /**
  * On init check if we want to show the attachment list with pagination or show all attachments
  */
  ngOnInit() {
    if (this.envPagination.enabled) {
      this.initPageOptions();
    }
    this.retrieveBitstreams();
  }

  /**
   * Retrieve the list of bitstream to show
   */
  retrieveBitstreams(): void {
    this.getBitstreams().pipe(
      map((bitstreamList: PaginatedList<Bitstream>) => this.filterBitstreamsByType(bitstreamList.page)),
      take(1)
    ).subscribe((bitstreams: Bitstream[]) => {
      if (this.envPagination.enabled) {
        this.currentPageInfo = new PageInfo({
            elementsPerPage: this.pageOptions.elementsPerPage,
            totalElements: bitstreams.length,
            totalPages: Math.ceil(bitstreams.length / this.pageOptions.elementsPerPage),
            currentPage: this.pageOptions.currentPage
          }
        );
        this.allBitstreams$.next(bitstreams);

        this.bitstreams$.next(this.getPaginatedBitstreams(this.pageOptions.currentPage));
      } else {
        this.bitstreams$.next(bitstreams);
      }
    });
  }

  /**
   * When view more is clicked show the next page and check if view more button should be shown
   */
  viewMore() {
    this.currentPageInfo.currentPage++;
    this.bitstreams$.next(this.getPaginatedBitstreams(this.currentPageInfo.currentPage));
  }

  /**
   * Get the list of paginated bitstreams that will be shown
   */
  protected getPaginatedBitstreams(page: number): Bitstream[] {
    this.canViewMore = this.currentPageInfo?.currentPage !== this.currentPageInfo?.totalPages;
    return this.allBitstreams$.value.filter((bitstream: Bitstream, index) => {
      return index < this.pageOptions.elementsPerPage * page;
    });
  }

  /**
   * Init page option according to configuration
   * @protected
   */
  protected initPageOptions(): void {
    this.pageOptions = Object.assign(new FindListOptions(), {
      elementsPerPage: this.envPagination.elementsPerPage,
      currentPage: 1
    });
  }
}
