import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
@Component({
  selector: 'ds-item-page-file-section',
  templateUrl: './file-section.component.html'
})
export class FileSectionComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.files';

  separator = '<br/>';

  bitstreamsObs: Observable<Bitstream[]>;

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.bitstreamsObs = this.item.getFiles();
  }

}
