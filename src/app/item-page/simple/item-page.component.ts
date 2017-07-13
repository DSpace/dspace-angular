import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../core/shared/item.model';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
})
export class ItemPageComponent implements OnInit {

  id: number;

  private sub: any;

  item: RemoteData<Item>;

  thumbnail: Observable<Bitstream>;

  constructor(private route: ActivatedRoute, private items: ItemDataService) {

  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.initialize(params);
    });
  }

  initialize(params) {
    this.id = +params.id;
    this.item = this.items.findById(params.id);
    this.thumbnail = this.item.payload.flatMap((i) => i.getThumbnail());
  }

}
