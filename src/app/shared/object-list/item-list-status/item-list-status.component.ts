import { Component, Input, OnInit } from '@angular/core';
import { ItemStatusType } from './item-status-type';

@Component({
  selector: 'ds-item-list-status',
  templateUrl: 'item-list-status.component.html'
})

export class ItemListStatusComponent implements OnInit {

  @Input() status: ItemStatusType;
  public badgeClass: string;
  public badgeContent: string;

  ngOnInit() {
    this.badgeContent = this.status;
    switch (this.status) {
      case ItemStatusType.REJECTED:
        this.badgeClass = 'badge-danger';
        break;
      case ItemStatusType.VALIDATION:
        this.badgeClass = 'badge-warning';
        break;
      case ItemStatusType.WAITING_CONTROLLER:
        this.badgeClass = 'badge-info';
        break;
      case ItemStatusType.IN_PROGRESS:
        this.badgeClass = 'badge-primary';
        break;
      case ItemStatusType.ACCEPTED:
        this.badgeClass = 'badge-success';
        break;
      case ItemStatusType.WORKFLOW:
        this.badgeClass = 'badge-info';
        break;
    }
  }

}
