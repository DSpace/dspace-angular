import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { MetadataService } from '../../core/metadata/metadata.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { Item } from '../../core/shared/item.model';
import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class ItemPageComponent implements OnInit {

  id: number;

  private sub: any;

  itemRD$: Observable<RemoteData<Item>>;

  thumbnail$: Observable<Bitstream>;

  constructor(
    private route: ActivatedRoute,
    private items: ItemDataService,
    private metadataService: MetadataService
  ) {

  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.metadataService.processRemoteData(this.itemRD$);
    this.thumbnail$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      mergeMap((item: Item) => item.getThumbnail()),);
  }
}
