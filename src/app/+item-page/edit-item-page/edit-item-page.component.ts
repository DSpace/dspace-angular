import {fadeIn, fadeInOut} from '../../shared/animations/fade';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {RemoteData} from '../../core/data/remote-data';
import {Item} from '../../core/shared/item.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'ds-edit-item-page',
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

  /**
   * The item to edit
   */
  itemRD$: Observable<RemoteData<Item>>;
  params$: Observable<Params>;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.params$ = this.route.params;
  }

}
