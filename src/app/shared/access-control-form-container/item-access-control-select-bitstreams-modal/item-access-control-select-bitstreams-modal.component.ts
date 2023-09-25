import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { Context } from 'src/app/core/shared/context.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { Item } from '../../../core/shared/item.model';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { hasValue } from '../../empty.util';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';
import { NgIf, AsyncPipe } from '@angular/common';

export const ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID = 'item-access-control-select-bitstreams';

@Component({
    selector: 'ds-item-access-control-select-bitstreams-modal',
    templateUrl: './item-access-control-select-bitstreams-modal.component.html',
    styleUrls: ['./item-access-control-select-bitstreams-modal.component.scss'],
    standalone: true,
    imports: [NgIf, ObjectCollectionComponent, AsyncPipe, TranslateModule]
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
