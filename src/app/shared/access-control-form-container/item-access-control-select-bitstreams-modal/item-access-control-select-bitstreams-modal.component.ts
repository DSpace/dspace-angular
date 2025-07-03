import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { Context } from 'src/app/core/shared/context.model';

import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Item } from '../../../core/shared/item.model';
import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';

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
