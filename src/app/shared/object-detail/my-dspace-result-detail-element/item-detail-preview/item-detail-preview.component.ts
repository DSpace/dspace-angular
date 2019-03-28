import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { fadeInOut } from '../../../animations/fade';
import { Bitstream } from '../../../../core/shared/bitstream.model';

/**
 * This component show metadata for the given item object in the detail view.
 */
@Component({
  selector: 'ds-item-detail-preview',
  styleUrls: ['./item-detail-preview.component.scss'],
  templateUrl: './item-detail-preview.component.html',
  animations: [fadeInOut]
})
export class ItemDetailPreviewComponent {

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The mydspace result object
   */
  @Input() object: any;

  /**
   * Represent item's status
   */
  @Input() status: MyDspaceItemStatusType;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * The item's thumbnail
   */
  public thumbnail$: Observable<Bitstream>;

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.thumbnail$ = this.item.getThumbnail();
  }

}
