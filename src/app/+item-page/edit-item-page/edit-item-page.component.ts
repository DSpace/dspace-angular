import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-edit-item-page',
  styleUrls: ['./edit-item-page.component.scss'],
  templateUrl: './edit-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Page component for editing an item
 */
export class EditItemPageComponent implements OnInit {

  objectKeys = Object.keys;

  /**
   * The item to edit
   */
  itemRD$: Observable<RemoteData<Item>>;
  statusData$: Observable<any>;

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.map((data) => data.item);
    this.statusData$ = this.itemRD$.pipe(
      getSucceededRemoteData(),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      map((item: Item) => Object.assign({
        id: item.id,
        handle: item.handle,
        lastModified: item.lastModified
      }))
    )
  }

  getItemPage(): string {
    return this.router.url.substr(0, this.router.url.lastIndexOf('/'));
  }

}
