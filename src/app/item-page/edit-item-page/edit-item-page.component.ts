import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import {
  ActivatedRoute,
  CanActivateFn,
  Route,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import {
  fadeIn,
  fadeInOut,
} from '../../shared/animations/fade';

@Component({
  selector: 'ds-edit-item-page',
  templateUrl: './edit-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    AsyncPipe,
    NgbTooltip,
    NgClass,
    RouterLink,
    RouterOutlet,
    TranslateModule,
  ],
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
  pages: { page: string, enabled: Observable<boolean> }[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private injector: Injector,
    private items: ItemDataService,
  ) {
    this.router.events.subscribe(() => this.initPageParamsByRoute());
  }

  ngOnInit(): void {
    this.initPageParamsByRoute();
    this.pages = this.route.routeConfig.children
      .filter((child: Route) => isNotEmpty(child.path))
      .map((child: Route) => {
        let enabled = of(true);
        if (isNotEmpty(child.canActivate)) {
          enabled = observableCombineLatest(child.canActivate.map((guardFn: CanActivateFn) => {
            return runInInjectionContext(this.injector, () => {
              return guardFn(this.route.snapshot, this.router.routerState.snapshot);
            });
          }),
          ).pipe(
            map((canActivateOutcomes: any[]) => canActivateOutcomes.every((e) => e === true)),
          );
        }
        return { page: child.path, enabled: enabled };
      });

    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso),
      switchMap((rd: RemoteData<Item>) => {
        if (rd?.hasSucceeded && rd?.payload?._links?.self?.href) {
          return this.items.findByHref(rd.payload._links.self.href, true, false);
        }
        return of(rd);
      }),
      getFirstCompletedRemoteData(),
    );
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    if (!item) {return null;}
    // Extract UUID from current edit URL instead of using item metadata
    // This avoids the resolver redirecting back to the (possibly deleted) custom URL
    const currentUrl = this.router.url;
    const uuidMatch = currentUrl.match(/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\//);
    if (uuidMatch) {
      const uuid = uuidMatch[1];
      const type = item.firstMetadataValue('dspace.entity.type');
      if (type) {
        return `/entities/${encodeURIComponent(type.toLowerCase())}/${uuid}`;
      }
      return `/items/${uuid}`;
    }
    // Fallback
    const type = item.firstMetadataValue('dspace.entity.type');
    return type
      ? `/entities/${encodeURIComponent(type.toLowerCase())}/${item.uuid}`
      : `/items/${item.uuid}`;
  }

  /**
   * Set page params depending on the route
   */
  initPageParamsByRoute() {
    this.currentPage = this.route.snapshot.firstChild.routeConfig.path;
  }
}
