import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
} from '@angular/router';
import { SectionDataService } from '@dspace/core/data/section-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SectionComponent } from '../core/layout/models/section.model';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { ThemedBrowseSectionComponent } from '../shared/explore/section-component/browse-section/themed-browse-section.component';
import { ThemedCountersSectionComponent } from '../shared/explore/section-component/counters-section/themed-counters-section.component';
import { ThemedFacetSectionComponent } from '../shared/explore/section-component/facet-section/themed-facet-section.component';
import { ThemedSearchSectionComponent } from '../shared/explore/section-component/search-section/themed-search-section.component';
import { ThemedTextSectionComponent } from '../shared/explore/section-component/text-section/themed-text-section.component';
import { ThemedTopSectionComponent } from '../shared/explore/section-component/top-section/themed-top-section.component';

/**
 * Main container component for dynamic explore pages.
 *
 * Fetches section configuration from the backend based on the current route parameter
 * and renders the configured sections as a responsive grid of section components.
 * Supported section types include: top, browse, search, facet, text-row, and counters.
 */
@Component({
  selector: 'ds-explore',
  templateUrl: './explore-page.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    ThemedBrowseSectionComponent,
    ThemedCountersSectionComponent,
    ThemedFacetSectionComponent,
    ThemedSearchSectionComponent,
    ThemedTextSectionComponent,
    ThemedTopSectionComponent,
  ],
})
export class ExplorePageComponent implements OnInit {

  /**
   * Identifier for the current explore section, derived from the ':id' route parameter.
   */
  sectionId: string;

  /**
   * Observable emitting a 2D array of section components organized in rows for grid layout.
   * Each inner array represents a row of components to be rendered side-by-side.
   */
  sectionComponentRows: Observable<SectionComponent[][]>;

  constructor(
        private route: ActivatedRoute,
        private sectionDataService: SectionDataService ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => this.setupSectionComponents(params));
  }

  /**
   * Fetches the section configuration from the backend and resolves
   * the section's component rows into the {@link sectionComponentRows} observable.
   *
   * @param params the route params containing the explore section 'id'
   */
  setupSectionComponents( params: Params ) {
    this.sectionId = params.id;
    this.sectionComponentRows = this.sectionDataService.findById(params.id ).pipe(
      getFirstSucceededRemoteDataPayload(),
      map ( (section) => section.componentRows),
    );
  }

  /**
   * Checks if a style string already contains a Bootstrap column class (e.g. 'col' or 'col-*').
   * Used to determine whether a default column class should be applied to a grid cell.
   *
   * @param style the style of the cell (a space-separated list of CSS classes)
   * @returns true if the style contains a Bootstrap column class
   */
  hasColClass(style) {
    return style?.split(' ').filter((c) => (c === 'col' || c.startsWith('col-'))).length > 0;
  }

}
