import { AbstractPaginatedDragAndDropListComponent } from '../../../../../shared/pagination-drag-and-drop/abstract-paginated-drag-and-drop-list.component';
import { Component, Input, OnInit } from '@angular/core';
import { Bundle } from '../../../../../core/shared/bundle.model';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { ObjectUpdatesService } from '../../../../../core/data/object-updates/object-updates.service';
import { BundleDataService } from '../../../../../core/data/bundle-data.service';
import { switchMap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../../../../../shared/search/paginated-search-options.model';

@Component({
  selector: 'ds-paginated-drag-and-drop-bitstream-list',
  styleUrls: ['../../item-bitstreams.component.scss'],
  templateUrl: './paginated-drag-and-drop-bitstream-list.component.html',
})
export class PaginatedDragAndDropBitstreamListComponent extends AbstractPaginatedDragAndDropListComponent<Bitstream> implements OnInit {
  /**
   * The bundle to display bitstreams for
   */
  @Input() bundle: Bundle;

  constructor(protected objectUpdatesService: ObjectUpdatesService,
              protected bundleService: BundleDataService) {
    super(objectUpdatesService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeObjectsRD(): void {
    this.objectsRD$ = this.currentPage$.pipe(
      switchMap((page: number) => this.bundleService.getBitstreams(this.bundle.id,
        new PaginatedSearchOptions({pagination: Object.assign({}, this.options, { currentPage: page })})))
    );
  }

  initializeURL(): void {
    this.url = this.bundle.self;
  }
}
