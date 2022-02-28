import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInOut } from '../../../animations/fade';
import { Item } from '../../../../core/shared/item.model';
import { SearchResult } from '../../../search/models/search-result.model';

@Component({
  selector: 'ds-relationships-items-list-preview',
  templateUrl: './relationships-items-list-preview.component.html',
  styleUrls: ['./relationships-items-list-preview.component.scss'],
  animations: [fadeInOut]
})
export class RelationshipsItemsListPreviewComponent {

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The custom information object
   */
  @Input() customData: any;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * An string utilized for specifying the type of view which component is being used for
   */
  @Input() viewConfig = 'default';

  /**
   * Emit when trying to delete the relationship
   */
  @Output() deleteRelationship = new EventEmitter<any>();

  processing = false;

  /**
   * When a button is clicked emit the event to the parent components
   */
  dispatchDelete(): void {
    this.processing = true;
    this.deleteRelationship.emit({ action: 'delete', item: this.object, relationship: this.customData.relationship });
  }
}
