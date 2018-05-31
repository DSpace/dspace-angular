import { Component, Input, OnInit } from '@angular/core';
import { ItemStatusType } from './item-status-type';

@Component({
  selector: 'ds-item-status',
  styleUrls: ['./item-status.component.scss'],
  templateUrl: './item-status.component.html'
})

export class ItemStatusComponent implements OnInit {

  @Input() status: ItemStatusType;
  public badgeClass: string;
  public badgeContent: string;

  ngOnInit() {
    this.badgeContent = this.status;
    this.badgeClass = 'text-light badge ';
    switch (this.status) {
      case ItemStatusType.REJECTED:
        this.badgeClass += 'badge-danger';
        break;
      case ItemStatusType.VALIDATION:
        this.badgeClass += 'badge-warning';
        break;
      case ItemStatusType.WAITING_CONTROLLER:
        this.badgeClass += 'badge-info';
        break;
      case ItemStatusType.IN_PROGRESS:
        this.badgeClass += 'badge-primary';
        break;
      case ItemStatusType.ACCEPTED:
        this.badgeClass += 'badge-success';
        break;
      case ItemStatusType.WORKFLOW:
        this.badgeClass += 'badge-info';
        break;
    }
  }

}
