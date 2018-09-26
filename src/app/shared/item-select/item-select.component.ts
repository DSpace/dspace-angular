import { Component, Input, OnInit } from '@angular/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-item-select',
  styleUrls: ['./item-select.component.scss'],
  templateUrl: './item-select.component.html'
})

export class ItemSelectComponent implements OnInit {

  @Input()
  items$: Observable<RemoteData<PaginatedList<Item>>>;

  checked: boolean[] = [];

  constructor(private itemDataService: ItemDataService) {
  }

  ngOnInit(): void {
    this.items$ = this.itemDataService.findAll({});
  }

}
