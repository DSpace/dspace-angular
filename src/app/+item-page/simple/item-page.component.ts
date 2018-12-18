import { filter, map, mergeMap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';

import { Item } from '../../core/shared/item.model';

import { MetadataService } from '../../core/metadata/metadata.service';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import * as viewMode from '../../shared/view-mode';

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

  /**
   * The item's id
   */
  id: number;

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The item's thumbnail
   */
  thumbnail$: Observable<Bitstream>;

  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  ElementViewMode = viewMode.ElementViewMode;

  constructor(
    private route: ActivatedRoute,
    private items: ItemDataService,
    private metadataService: MetadataService,
  ) { }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.metadataService.processRemoteData(this.itemRD$);
    this.thumbnail$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      mergeMap((item: Item) => item.getThumbnail()),);
  }
}
