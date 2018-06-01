import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';

import { Item } from '../../core/shared/item.model';

import { MetadataService } from '../../core/metadata/metadata.service';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import * as viewMode from '../../shared/view-mode';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

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

  private sub: Subscription;
  private itemSub: Subscription;
  thumbnailObs: Observable<Bitstream>;

  itemRDObs: BehaviorSubject<RemoteData<Item>> = new BehaviorSubject(new RemoteData(true, true, undefined, null, null));

  ElementViewMode = viewMode.ElementViewMode;

  constructor(
    private route: ActivatedRoute,
    private items: ItemDataService,
    private metadataService: MetadataService,
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.initialize(params);
    });

  }

  initialize(params) {
    this.id = +params.id;
    if (hasValue(this.itemSub)) {
      this.itemSub.unsubscribe();
    }
    this.itemSub = this.items.findById(params.id).subscribe((item) => this.itemRDObs.next(item));
    this.metadataService.processRemoteData(this.itemRDObs);
    this.thumbnailObs = this.itemRDObs
      .map((rd: RemoteData<Item>) => rd.payload)
      .filter((item: Item) => hasValue(item))
      .flatMap((item: Item) => item.getThumbnail());
  }
}
