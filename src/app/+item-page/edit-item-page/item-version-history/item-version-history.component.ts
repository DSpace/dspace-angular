import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ds-item-version-history',
  templateUrl: './item-version-history.component.html'
})
export class ItemVersionHistoryComponent {
  /**
   * The item to display the version history for
   */
  itemRD$: Observable<RemoteData<Item>>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item)).pipe(getSucceededRemoteData()) as Observable<RemoteData<Item>>;
  }
}
