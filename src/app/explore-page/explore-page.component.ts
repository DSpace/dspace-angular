import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SectionComponent } from '../core/layout/models/section.model';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { ThemedBrowseSectionComponent } from '../shared/explore/section-component/browse-section/themed-browse-section.component';
import { ThemedCountersSectionComponent } from '../shared/explore/section-component/counters-section/themed-counters-section.component';
import { ThemedFacetSectionComponent } from '../shared/explore/section-component/facet-section/themed-facet-section.component';
import { ThemedSearchSectionComponent } from '../shared/explore/section-component/search-section/themed-search-section.component';
import { ThemedTextSectionComponent } from '../shared/explore/section-component/text-section/themed-text-section.component';
import { ThemedTopSectionComponent } from '../shared/explore/section-component/top-section/themed-top-section.component';

/**
 * Component representing the explore section.
 */
@Component({
  selector: 'ds-explore',
  templateUrl: './explore-page.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    ThemedTopSectionComponent,
    ThemedBrowseSectionComponent,
    ThemedSearchSectionComponent,
    ThemedFacetSectionComponent,
    ThemedTextSectionComponent,
    ThemedCountersSectionComponent,
    NgSwitchCase,
    NgSwitch,
    AsyncPipe,
  ],
})
export class ExplorePageComponent implements OnInit {

  /**
     * The id of the current section.
     */
  sectionId: string;

  /**
     * Resolved section components splitted in rows.
     */
  sectionComponentRows: Observable<SectionComponent[][]>;

  constructor(
        private route: ActivatedRoute,
        private sectionDataService: SectionDataService ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => this.setupSectionComponents(params));
  }

  /**
     * Setup the section components of the explore page based on the section id.
     *
     * @param params the route params
     */
  setupSectionComponents( params: Params ) {
    this.sectionId = params.id;
    this.sectionComponentRows = this.sectionDataService.findById(params.id ).pipe(
      getFirstSucceededRemoteDataPayload(),
      map ( (section) => section.componentRows),
    );
  }

  /**
   * Check if style contains 'col' or 'col-x'
   * @param style the style of the cell (a list of classes separated by space)
   */
  hasColClass(style) {
    return style?.split(' ').filter((c) => (c === 'col' || c.startsWith('col-'))).length > 0;
  }

}
