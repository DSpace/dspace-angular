import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { takeUntilCompletedRemoteData } from '../../../../core/shared/operators';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/internal/Observable';

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
