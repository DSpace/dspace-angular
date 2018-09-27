import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../core/shared/item.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { ItemSelectService } from './item-select.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ds-item-select',
  styleUrls: ['./item-select.component.scss'],
  templateUrl: './item-select.component.html'
})

export class ItemSelectComponent implements OnInit {

  @Input()
  itemsRD$: Observable<RemoteData<PaginatedList<Item>>>;

  @Input()
  paginationOptions: PaginationComponentOptions;

  @Output()
  confirm: EventEmitter<string[]> = new EventEmitter<string[]>();

  selectedIds$: Observable<string[]>;

  constructor(private itemSelectService: ItemSelectService) {
  }

  ngOnInit(): void {
    this.selectedIds$ = this.itemSelectService.getAllSelected();
  }

  switch(id: string) {
    this.itemSelectService.switch(id);
  }

  getSelected(id: string): Observable<boolean> {
    return this.itemSelectService.getSelected(id);
  }

  confirmSelected() {
    this.selectedIds$.pipe(
      take(1)
    ).subscribe((ids: string[]) => {
      this.confirm.emit(ids);
      this.itemSelectService.reset();
    });
  }

}
