import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';

export const ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID = 'item-access-control-select-bitstreams';

@Component({
  selector: 'ds-item-access-control-select-bitstreams-modal',
  templateUrl: './item-access-control-select-bitstreams-modal.component.html',
  styleUrls: ['./item-access-control-select-bitstreams-modal.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    ObjectCollectionComponent,
    TranslateModule,
  ],
})
export class ItemAccessControlSelectBitstreamsModalComponent implements OnInit, OnDestroy {

  LIST_ID = ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID;

  @Input() item!: Item;
  @Input() selectedBitstreams: string[] = [];

  bitstreams$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  context: Context = Context.Bitstream;

  paginationConfig = Object.assign(new PaginationComponentOptions(), {
    id: 'iacsbm',
    currentPage: 1,
    pageSize: 5,
  });

  constructor(
    private bitstreamService: BitstreamDataService,
    protected paginationService: PaginationService,
    protected translateService: TranslateService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.bitstreams$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamService.findAllByItemAndBundleName(
        this.item,
        'ORIGINAL',
        { elementsPerPage: options.pageSize, currentPage: options.currentPage },
        true,
        true,
      )),
    );
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

}
