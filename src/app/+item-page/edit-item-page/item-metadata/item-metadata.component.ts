import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Metadatum } from '../../../core/shared/metadatum.model';

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

  constructor(private itemService: ItemDataService) {

  }

  update() {
    this.itemService.update(this.item).subscribe();
  }

  removeMetadata(i: number) {
    this.item.metadata = this.item.metadata.filter((metadatum: Metadatum, index: number) => index !== i);
    this.update();
  }

  addMetadata() {
    this.item.metadata = [new Metadatum(), ...this.item.metadata];
    this.update();
  }
}
