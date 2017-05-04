import { Component, Input } from '@angular/core';
import { Bitstream } from "../../core/shared/bitstream.model";
import { Item } from "../../core/shared/item.model";

@Component({
  selector: 'ds-metadata-field-wrapper',
  styleUrls: ['./metadata-field-wrapper.component.css'],
  templateUrl: './metadata-field-wrapper.component.html'
})
export class MetadataFieldWrapperComponent {

  @Input() item: Item;
  files: Array<Bitstream>;

  constructor() {
    this.universalInit();

  }

  universalInit() {
    this.files = this.item.getBundle("ORIGINAL").map(bundle => bundle.bitstreams.map(bitstream => bitstream.payload));
  }

}
