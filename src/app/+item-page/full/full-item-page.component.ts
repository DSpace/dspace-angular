
import {filter, map} from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { ItemPageComponent } from '../simple/item-page.component';
import { Metadatum } from '../../core/shared/metadatum.model';
import { ItemDataService } from '../../core/data/item-data.service';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';

import { MetadataService } from '../../core/metadata/metadata.service';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-full-item-page',
  styleUrls: ['./full-item-page.component.scss'],
  templateUrl: './full-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class FullItemPageComponent extends ItemPageComponent implements OnInit {

  itemRD$: Observable<RemoteData<Item>>;

  metadata$: Observable<Metadatum[]>;

  constructor(route: ActivatedRoute, items: ItemDataService, metadataService: MetadataService) {
    super(route, items, metadataService);
  }

  /*** AoT inheritance fix, will hopefully be resolved in the near future **/
  ngOnInit(): void {
    super.ngOnInit();
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata),);
  }
}
