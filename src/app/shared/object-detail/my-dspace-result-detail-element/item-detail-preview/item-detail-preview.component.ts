import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { fadeInOut } from '../../../animations/fade';
import { Bitstream } from '../../../../core/shared/bitstream.model';

@Component({
  selector: 'ds-item-detail-preview',
  styleUrls: ['./item-detail-preview.component.scss'],
  templateUrl: './item-detail-preview.component.html',
  animations: [fadeInOut]
})
export class ItemDetailPreviewComponent<T> {

  @Input() item: Item;
  @Input() object: any;
  @Input() status: MyDspaceItemStatusType;

  public ALL_STATUS = [];
  public thumbnail$: Observable<Bitstream>;

  ngOnInit() {
    Object.keys(MyDspaceItemStatusType).forEach((s) => {
      this.ALL_STATUS.push(MyDspaceItemStatusType[s]);
    });
    this.thumbnail$ = this.item.getThumbnail();
  }

}
