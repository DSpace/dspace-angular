import { Component, Input, OnInit } from '@angular/core';
import { ItemStatusType } from '../../../core/shared/item-status';

@Component({
  selector: 'ds-item-list-status',
  templateUrl: 'item-list-status.component.html'
})

export class ItemListStatusComponent implements OnInit {

  @Input()
  statusTxt: string;
  public ALL_STATUS = [];

  ngOnInit() {
    Object.keys(ItemStatusType).forEach((s) => {
      this.ALL_STATUS.push(ItemStatusType[s]);
    });
  }

}
