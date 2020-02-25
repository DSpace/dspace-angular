import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstSucceededRemoteListPayload } from '../../../../core/shared/operators';

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

  bitstreams$: Observable<Bitstream[]>;

  constructor(
    protected bitstreamDataService: BitstreamDataService
  ) {
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.bitstreams$ = this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL').pipe(
      getFirstSucceededRemoteListPayload()
    );
  }

}
