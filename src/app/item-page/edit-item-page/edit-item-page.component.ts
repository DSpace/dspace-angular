import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  CanActivate,
  Route,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { Item } from '../../core/shared/item.model';
import {
  fadeIn,
  fadeInOut,
} from '../../shared/animations/fade';
import { isNotEmpty } from '../../shared/empty.util';
import { getItemPageRoute } from '../item-page-routing-paths';

@Component({
  selector: 'ds-edit-item-page',
  templateUrl: './edit-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    TranslateModule,
    NgClass,
    NgIf,
    NgForOf,
    AsyncPipe,
    NgbTooltipModule,
    RouterLink,
    RouterOutlet,
  ],
  standalone: true,
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

  constructor(private route: ActivatedRoute, private router: Router, private injector: Injector) {
    this.router.events.subscribe(() => this.initPageParamsByRoute());
  }

  ngOnInit(): void {
    this.initPageParamsByRoute();
    this.pages = this.route.routeConfig.children
      .filter((child: Route) => isNotEmpty(child.path))
      .map((child: Route) => {
        let enabled = observableOf(true);
        if (isNotEmpty(child.canActivate)) {
          enabled = observableCombineLatest(child.canActivate.map((guardConstructor: GenericConstructor<CanActivate>) => {
            const guard: CanActivate = this.injector.get<CanActivate>(guardConstructor);
            return guard.canActivate(this.route.snapshot, this.router.routerState.snapshot);
          }),
          ).pipe(
            map((canActivateOutcomes: any[]) => canActivateOutcomes.every((e) => e === true)),
          );
        }
        return { page: child.path, enabled: enabled };
      }); // ignore reroutes
    this.itemRD$ = this.route.data.pipe(map((data) => data.dso));
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    return getItemPageRoute(item);
  }

  /**
   * Set page params depending on the route
   */
  initPageParamsByRoute() {
    this.currentPage = this.route.snapshot.firstChild.routeConfig.path;
  }
}
