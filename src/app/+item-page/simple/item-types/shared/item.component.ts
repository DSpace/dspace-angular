import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../item-page-routing-paths';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  mediaViewer = environment.mediaViewer;

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
  }
}
