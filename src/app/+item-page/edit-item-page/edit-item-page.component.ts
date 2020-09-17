import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { getItemPageRoute } from '../item-page-routing-paths';

@Component({
  selector: 'ds-edit-item-page',
  templateUrl: './edit-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Page component for editing an item
 */
export class EditItemPageComponent implements OnInit {

  /**
   * The item to edit
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The current page outlet string
   */
  currentPage: string;

  /**
   * All possible page outlet strings
   */
  pages: string[];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events.subscribe(() => {
      this.currentPage = this.route.snapshot.firstChild.routeConfig.path;
    });
  }

  ngOnInit(): void {
    this.pages = this.route.routeConfig.children
      .map((child: any) => child.path)
      .filter((path: string) => isNotEmpty(path)); // ignore reroutes
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    return getItemPageRoute(item.id)
  }
}
