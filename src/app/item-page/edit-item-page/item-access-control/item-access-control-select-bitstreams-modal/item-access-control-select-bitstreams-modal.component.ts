import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { TranslateService } from '@ngx-translate/core';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { hasValue } from '../../../../shared/empty.util';
import { Context } from '../../../../core/shared/context.model';

export const ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID = 'item-access-control-select-bitstreams'

@Component({
  selector: 'ds-item-access-control-select-bitstreams-modal',
  templateUrl: './item-access-control-select-bitstreams-modal.component.html',
  styleUrls: [ './item-access-control-select-bitstreams-modal.component.scss' ]
})
export class ItemAccessControlSelectBitstreamsModalComponent implements OnInit {

  LIST_ID = ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID;

  @Input() item!: Item;
  @Input() selectedBitstreams: string[] = [];

  data$ = new BehaviorSubject<RemoteData<PaginatedList<Bitstream>> | null>(null);
  paginationConfig: PaginationComponentOptions;
  pageSize = 5;

  context: Context = Context.Bitstream;

  constructor(
    private bitstreamService: BitstreamDataService,
    protected paginationService: PaginationService,
    protected translateService: TranslateService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.loadForPage(1);

    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'iacsbm';
    this.paginationConfig.currentPage = 1;
    if (hasValue(this.pageSize)) {
      this.paginationConfig.pageSize = this.pageSize;
    }
  }

  loadForPage(page: number) {
    this.bitstreamService.findAllByItemAndBundleName(this.item, 'ORIGINAL', { currentPage: page}, false)
      .pipe(
        getFirstCompletedRemoteData(),
      )
      .subscribe(this.data$);
  }

}
