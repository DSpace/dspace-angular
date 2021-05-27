import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload, takeUntilCompletedRemoteData } from '../../../../core/shared/operators';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RemoteData } from '../../../../core/data/remote-data';

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
   * The Item's thumbnail
   */
  thumbnail$: BehaviorSubject<RemoteData<Bitstream>>;

  /**
   * Route to the item page
   */
  itemPageRoute: string;
  mediaViewer = environment.mediaViewer;

  constructor(protected bitstreamDataService: BitstreamDataService) {
  }

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);

    this.thumbnail$ = new BehaviorSubject<RemoteData<Bitstream>>(undefined);
    this.bitstreamDataService.getThumbnailFor(this.object).pipe(
      takeUntilCompletedRemoteData(),
    ).subscribe((rd: RemoteData<Bitstream>) => {
      this.thumbnail$.next(rd);
    });
  }
}
