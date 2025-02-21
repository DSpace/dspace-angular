import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { PaginatedList } from '../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { RemoteData } from '../../../../../modules/core/src/lib/core/data/remote-data';
import { Bitstream } from '../../../../../modules/core/src/lib/core/shared/bitstream.model';
import { Context } from '../../../../../modules/core/src/lib/core/shared/context.model';

import { BitstreamDataService } from '../../../../../modules/core/src/lib/core/data/bitstream-data.service';
import { PaginationService } from '../../../../../modules/core/src/lib/core/pagination/pagination.service';
import { Item } from '../../../../../modules/core/src/lib/core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../../modules/core/src/lib/core/shared/operators';
import { PaginationComponentOptions } from '../../../../../modules/core/src/lib/core/shared/pagination-component-options.model';
import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';

export const ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID = 'item-access-control-select-bitstreams';

@Component({
  selector: 'ds-item-access-control-select-bitstreams-modal',
  templateUrl: './item-access-control-select-bitstreams-modal.component.html',
  styleUrls: ['./item-access-control-select-bitstreams-modal.component.scss'],
  standalone: true,
  imports: [ObjectCollectionComponent, AsyncPipe, TranslateModule],
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
    public activeModal: NgbActiveModal,
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
    this.bitstreamService.findAllByItemAndBundleName(this.item, 'ORIGINAL', { currentPage: page }, false)
      .pipe(
        getFirstCompletedRemoteData(),
      )
      .subscribe(this.data$);
  }

}
