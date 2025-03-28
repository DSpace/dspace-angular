import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { RouteService } from '../../../../core/services/route.service';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import {
  getDSpaceQuery,
  isIiifEnabled,
  isIiifSearchEnabled,
} from './item-iiif-utils';

@Component({
  selector: 'ds-item',
  template: '',
  standalone: true,
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
   * This regex matches previous routes. The button is shown
   * for matching paths and hidden in other cases.
   */
  previousRoute = /^(\/search|\/browse|\/collections|\/admin\/search|\/mydspace)/;

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

  constructor(protected routeService: RouteService,
              protected router: Router) {
    this.mediaViewer = environment.mediaViewer;
    this.geospatialItemPageFieldsEnabled = environment.geospatialMapViewer.enableItemPageFields;
  }

  /**
   * The function used to return to list from the item.
   */
  back = () => {
    this.routeService.getPreviousUrl().pipe(
      take(1),
    ).subscribe(
      (url => {
        this.router.navigateByUrl(url);
      }),
    );
  };

  ngOnInit(): void {

    this.itemPageRoute = getItemPageRoute(this.object);
    // hide/show the back button
    this.showBackButton$ = this.routeService.getPreviousUrl().pipe(
      map((url: string) => this.previousRoute.test(url)),
      take(1),
    );
    // check to see if iiif viewer is required.
    this.iiifEnabled = isIiifEnabled(this.object);
    this.iiifSearchEnabled = isIiifSearchEnabled(this.object);
    if (this.iiifSearchEnabled) {
      this.iiifQuery$ = getDSpaceQuery(this.object, this.routeService);
    }
  }
}
