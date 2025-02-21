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
import { PaginatedList } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { Bitstream } from '@dspace/core';
import { Context } from '@dspace/core';

import { BitstreamDataService } from '@dspace/core';
import { PaginationService } from '@dspace/core';
import { Item } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { PaginationComponentOptions } from '@dspace/core';
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
