import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
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

  constructor(protected bitstreamDataService: BitstreamDataService) {
  }

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
  }

  // TODO refactor to return RemoteData, and thumbnail template to deal with loading
  getThumbnail(): Observable<Bitstream> {
    return this.bitstreamDataService.getThumbnailFor(this.object).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }
}
