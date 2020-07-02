import { AbstractPaginatedDragAndDropListComponent } from '../../../../../shared/pagination-drag-and-drop/abstract-paginated-drag-and-drop-list.component';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Bundle } from '../../../../../core/shared/bundle.model';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { ObjectUpdatesService } from '../../../../../core/data/object-updates/object-updates.service';
import { BundleDataService } from '../../../../../core/data/bundle-data.service';
import { switchMap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../../../../../shared/search/paginated-search-options.model';
import { ResponsiveTableSizes } from '../../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { ObjectValuesPipe } from '../../../../../shared/utils/object-values-pipe';
import { RequestService } from '../../../../../core/data/request.service';

@Component({
  selector: 'ds-paginated-drag-and-drop-bitstream-list',
  styleUrls: ['../../item-bitstreams.component.scss'],
  templateUrl: './paginated-drag-and-drop-bitstream-list.component.html',
})
/**
 * A component listing edit-bitstream rows for each bitstream within the given bundle.
 * This component makes use of the AbstractPaginatedDragAndDropListComponent, allowing for users to drag and drop
 * bitstreams within the paginated list. To drag and drop a bitstream between two pages, drag the row on top of the
 * page number you want the bitstream to end up at. Doing so will add the bitstream to the top of that page.
 */
export class PaginatedDragAndDropBitstreamListComponent extends AbstractPaginatedDragAndDropListComponent<Bitstream> implements OnInit {
  /**
   * The bundle to display bitstreams for
   */
  @Input() bundle: Bundle;

  /**
   * The bootstrap sizes used for the columns within this table
   */
  @Input() columnSizes: ResponsiveTableSizes;

  constructor(protected objectUpdatesService: ObjectUpdatesService,
              protected elRef: ElementRef,
              protected objectValuesPipe: ObjectValuesPipe,
              protected bundleService: BundleDataService,
              protected requestService: RequestService) {
    super(objectUpdatesService, elRef, objectValuesPipe);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Initialize the bitstreams observable depending on currentPage$
   */
  initializeObjectsRD(): void {
    this.objectsRD$ = this.currentPage$.pipe(
      switchMap((page: number) => {
        const paginatedOptions = new PaginatedSearchOptions({pagination: Object.assign({}, this.options, { currentPage: page })});
        return this.bundleService.getBitstreamsEndpoint(this.bundle.id, paginatedOptions).pipe(
          switchMap((href) => this.requestService.hasByHrefObservable(href)),
          switchMap(() => this.bundleService.getBitstreams(
            this.bundle.id,
            paginatedOptions,
            followLink('format')
          ))
        );
      })
    );
  }

  /**
   * Initialize the URL used for the field-update store, in this case the bundle's self-link
   */
  initializeURL(): void {
    this.url = this.bundle.self;
  }
}
