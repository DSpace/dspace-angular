import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent {
  @Input() object: Item;

  constructor(protected bitstreamDataService: BitstreamDataService) {
  }

  // TODO refactor to return RemoteData, and thumbnail template to deal with loading
  getThumbnail(): Observable<Bitstream> {
    return this.bitstreamDataService.getThumbnailFor(this.object).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }
}
