import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { AlertType } from '../../../shared/alert/alert-type';
import { VarDirective } from '../../../shared/utils/var.directive';
import { ItemVersionsComponent } from '../../versions/item-versions.component';

@Component({
  selector: 'ds-item-version-history',
  templateUrl: './item-version-history.component.html',
  imports: [
    ItemVersionsComponent,
    VarDirective,
    NgIf,
    AsyncPipe,
  ],
  standalone: true,
})
/**
 * Component for listing and managing an item's version history
 */
export class ItemVersionHistoryComponent {
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
