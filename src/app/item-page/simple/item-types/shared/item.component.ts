import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { RouteService } from '@dspace/core/services/route.service';
import { Item } from '@dspace/core/shared/item.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import {
  getDSpaceQuery,
  isIiifEnabled,
  isIiifSearchEnabled,
} from '@dspace/core/utilities/item-iiif-utils';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ds-item',
  template: '',
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel = true;

  /**
   * The viewmode we matched on to get this component
   */
  @Input() viewMode: ViewMode;

  /**
   * Session storage key for storing the previous URL before entering item page
   */
  private readonly ITEM_PREVIOUS_URL_SESSION_KEY = 'item-previous-url';

  /**
   * This regex matches previous routes. The button is shown
   * for matching paths and hidden in other cases.
   */
  previousRoute = /^(\/home|\/search|\/browse|\/collections|\/admin\/search|\/mydspace)/;

  /**
   * Used to show or hide the back to results button in the view.
   */
  showBackButton$: Observable<boolean>;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  /**
   * Enables the mirador component.
   */
  iiifEnabled: boolean;

  /**
   * Used to configure search in mirador.
   */
  iiifSearchEnabled: boolean;

  /**
   * The query term from the previous dspace search.
   */
  iiifQuery$: Observable<string>;

  mediaViewer;

  /**
   * Enables display of geospatial item page fields
   */
  geospatialItemPageFieldsEnabled = false;

  /**
   * Stores the previous URL retrieved either from RouteService or sessionStorage
   */
  private storedPreviousUrl: string;

  constructor(protected routeService: RouteService,
              protected router: Router) {
    this.mediaViewer = environment.mediaViewer;
    this.geospatialItemPageFieldsEnabled = environment.geospatialMapViewer.enableItemPageFields;
  }

  /**
   * The function used to return to list from the item.
   * Uses stored previous URL if available, otherwise falls back to browser history.
   */
  back = () => {
    this.router.navigateByUrl(this.storedPreviousUrl);
  };

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
    // hide/show the back button
    this.showBackButton$ = this.routeService.getPreviousUrl().pipe(
      take(1),
      map(url => {
        const fromRoute = this.pickAllowedPrevious(url);

        if (fromRoute) {
          this.routeService.storeUrlInSession(this.ITEM_PREVIOUS_URL_SESSION_KEY, fromRoute);
          this.storedPreviousUrl = fromRoute;
          return true;
        }

        const storedUrl = this.routeService.getUrlFromSession(this.ITEM_PREVIOUS_URL_SESSION_KEY);
        if (this.pickAllowedPrevious(storedUrl)) {
          this.storedPreviousUrl = storedUrl;
          return true;
        }

        return false;
      }),
    );
    // check to see if iiif viewer is required.
    this.iiifEnabled = isIiifEnabled(this.object);
    this.iiifSearchEnabled = isIiifSearchEnabled(this.object);
    if (this.iiifSearchEnabled) {
      this.iiifQuery$ = getDSpaceQuery(this.object, this.routeService);
    }
  }

  /**
   * Helper to check if a URL is from an allowed previous route and return it, otherwise null
   */
  private pickAllowedPrevious(url?: string | null): string | null {
    return url && this.previousRoute.test(url) ? url : null;
  }
}
