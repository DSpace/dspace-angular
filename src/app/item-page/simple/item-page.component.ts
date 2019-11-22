import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';

import { Item } from '../../core/shared/item.model';

import { MetadataService } from '../../core/metadata/metadata.service';

import { fadeInOut } from '../../shared/animations/fade';
import { redirectToPageNotFoundOn404 } from '../../core/shared/operators';
import { ViewMode } from '../../core/shared/view-mode.model';

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
   * The view-mode we're currently on
   */
  viewMode = ViewMode.StandalonePage;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private items: ItemDataService,
    private metadataService: MetadataService,
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.item as RemoteData<Item>),
      redirectToPageNotFoundOn404(this.router)
    );
    this.metadataService.processRemoteData(this.itemRD$);
  }
}
