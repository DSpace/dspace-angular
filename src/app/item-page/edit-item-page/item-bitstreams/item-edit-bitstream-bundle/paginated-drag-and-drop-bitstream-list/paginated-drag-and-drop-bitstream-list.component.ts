import {
  CdkDrag,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';

import { BundleDataService } from '../../../../../core/data/bundle-data.service';
import { ObjectUpdatesService } from '../../../../../core/data/object-updates/object-updates.service';
import { RequestService } from '../../../../../core/data/request.service';
import { PaginationService } from '../../../../../core/pagination/pagination.service';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { Bundle } from '../../../../../core/shared/bundle.model';
import { ThemedLoadingComponent } from '../../../../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../../shared/pagination/pagination-component-options.model';
import { AbstractPaginatedDragAndDropListComponent } from '../../../../../shared/pagination-drag-and-drop/abstract-paginated-drag-and-drop-list.component';
import { ResponsiveTableSizes } from '../../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { PaginatedSearchOptions } from '../../../../../shared/search/models/paginated-search-options.model';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { ObjectValuesPipe } from '../../../../../shared/utils/object-values-pipe';
import { VarDirective } from '../../../../../shared/utils/var.directive';
import { ItemEditBitstreamComponent } from '../../item-edit-bitstream/item-edit-bitstream.component';
import { ItemEditBitstreamDragHandleComponent } from '../../item-edit-bitstream-drag-handle/item-edit-bitstream-drag-handle.component';

@Component({
  selector: 'ds-paginated-drag-and-drop-bitstream-list',
  styleUrls: ['../../item-bitstreams.component.scss'],
  templateUrl: './paginated-drag-and-drop-bitstream-list.component.html',
  imports: [
    AsyncPipe,
    NgIf,
    PaginationComponent,
    NgClass,
    VarDirective,
    CdkDropList,
    NgForOf,
    CdkDrag,
    ItemEditBitstreamComponent,
    ItemEditBitstreamDragHandleComponent,
    CdkDragHandle,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
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
              protected paginationService: PaginationService,
              protected requestService: RequestService) {
    super(objectUpdatesService, elRef, objectValuesPipe, paginationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Initialize the bitstreams observable depending on currentPage$
   */
  initializeObjectsRD(): void {
    this.objectsRD$ = this.currentPage$.pipe(
      switchMap((page: PaginationComponentOptions) => {
        const paginatedOptions = new PaginatedSearchOptions({ pagination: Object.assign({}, page) });
        return this.bundleService.getBitstreamsEndpoint(this.bundle.id, paginatedOptions).pipe(
          switchMap((href) => this.requestService.hasByHref$(href)),
          switchMap(() => this.bundleService.getBitstreams(
            this.bundle.id,
            paginatedOptions,
            followLink('format'),
          )),
        );
      }),
    );
  }

  /**
   * Initialize the URL used for the field-update store, in this case the bundle's self-link
   */
  initializeURL(): void {
    this.url = this.bundle.self;
  }
}
