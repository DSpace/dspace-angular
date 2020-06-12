import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { map } from 'rxjs/operators';
import { redirectToPageNotFoundOn404 } from '../core/shared/operators';
import { Observable } from 'rxjs';
import { fadeInOut } from '../shared/animations/fade';

/**
 * This component is the entry point for the page that renders items.
 */
@Component({
  selector: 'ds-cris-item-page',
  templateUrl: './cris-item-page.component.html',
  styleUrls: ['./cris-item-page.component.scss'],
  animations: [fadeInOut]
})
export class CrisItemPageComponent implements OnInit {

  itemRD$: Observable<RemoteData<Item>>;
  item: Item;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.item as RemoteData<Item>),
      redirectToPageNotFoundOn404(this.router)
    );
    this.itemRD$.subscribe(
      (next) => {
        this.item = next.payload;
      }
    );
  }

}
