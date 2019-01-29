import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { DSOChangeAnalyzer } from '../../../core/data/dso-change-analyzer.service';

@Component({
  selector: 'ds-item-metadata',
  templateUrl: './item-metadata.component.html',
})
/**
 * Component for displaying an item's status
 */
export class ItemMetadataComponent {

  /**
   * The item to display the metadata for
   */
  @Input() item: Item;
  updateItem: Item;
  constructor(private itemService: ItemDataService, private dsoChanges: DSOChangeAnalyzer<Item>) {
    this.updateItem = Object.assign({}, this.item);
  }

  update() {
    this.dsoChanges.diff(this.item, this.updateItem);
  }

  // submit() {
  //
  // }
  //
  // discard() {
  //
  // }
  //
  // undo() {
  //
  // }
}
