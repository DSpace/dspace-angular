import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstSucceededRemoteData } from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AlertType } from '../../../shared/alert/alert-type';
import { VarDirective } from '../../../shared/utils/var.directive';
import { ItemVersionsComponent } from '../../versions/item-versions.component';

@Component({
  selector: 'ds-item-version-history',
  templateUrl: './item-version-history.component.html',
  imports: [
    AsyncPipe,
    ItemVersionsComponent,
    VarDirective,
  ],
  standalone: true,
})
/**
 * Component for listing and managing an item's version history
 */
export class ItemVersionHistoryComponent implements OnInit {
  /**
   * The item to display the version history for
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  AlertTypeEnum = AlertType;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(map((data) => data.dso)).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Item>>;
  }
}
