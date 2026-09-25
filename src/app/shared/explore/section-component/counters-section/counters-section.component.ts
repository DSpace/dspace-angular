import {
  AsyncPipe,
  isPlatformServer,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchManager } from '@dspace/core/browse/search-manager';
import { SectionComponent } from '@dspace/core/layout/models/section.model';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { InternalLinkService } from '@dspace/core/services/internal-link.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';


/**
 * Component that displays entity counts (e.g., number of publications, researchers)
 * fetched from discovery search configurations. Each counter shows the total number
 * of elements for a configured discovery query, rendered with an icon and optional link.
 */
@Component({
  selector: 'ds-base-counters-section',
  styleUrls: ['./counters-section.component.scss'],
  templateUrl: './counters-section.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class CountersSectionComponent implements OnInit {

  /** Unique identifier for this section instance. */
  @Input()
    sectionId: string;

  /** Configuration object defining the counters to display. */
  @Input()
    countersSection: CountersSection;

  /** Resolved array of counter data populated after fetching from discovery. */
  counterData: CounterData[] = [];

  /** Observable emitting the array of resolved counter data. */
  counterData$: Observable<CounterData[]>;

  /** Subject indicating whether counter data is still being loaded. */
  isLoading$ = new BehaviorSubject(true);

  pagination: PaginationComponentOptions;


  constructor(
              public internalLinkService: InternalLinkService,
              private searchService: SearchManager,
              @Inject(PLATFORM_ID) private platformId: any,
  ) {

  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.pagination  = Object.assign(new PaginationComponentOptions(), {
      id: 'counters-pagination' + this.sectionId,
      pageSize: 1,
      currentPage: 1,
    });

    this.counterData$ = forkJoin(
      this.countersSection.counterSettingsList.map((counterSettings: CountersSettings) =>
        this.searchService.search(new PaginatedSearchOptions({
          configuration: counterSettings.discoveryConfigurationName,
          pagination: this.pagination })).pipe(
          getFirstSucceededRemoteDataPayload(),
          map((rs: SearchObjects<DSpaceObject>) => rs.totalElements),
          map((total: number) => {
            return {
              count: total.toString(),
              label: counterSettings.entityName,
              icon: counterSettings.icon,
              link: counterSettings.link,

            };
          }),
        )));
    this.counterData$.subscribe(() => this.isLoading$.next(false));
  }
}



/**
 * Configuration for a counters section defining which discovery queries to count.
 */
export interface CountersSection extends SectionComponent {
  componentType: 'counters';
  /** List of counter settings, each defining a discovery query and display metadata. */
  counterSettingsList: CountersSettings[];
}

/**
 * Settings for an individual counter within a {@link CountersSection}.
 */
export interface CountersSettings {
  /** Discovery configuration name used to query the total count. */
  discoveryConfigurationName: string;
  /** Display label for the entity type (e.g., 'publications', 'researchers'). */
  entityName: string;
  /** CSS icon class to display alongside the counter (e.g., 'fas fa-book'). */
  icon: string;
  /** URL to navigate to when the counter is clicked. */
  link: string;
}

/**
 * Resolved counter data ready for rendering in the template.
 */
export interface CounterData {
  /** Display label for the counter. */
  label: string;
  /** The total count as a string. */
  count: string;
  /** CSS icon class for display. */
  icon: string;
  /** URL to navigate to when the counter is clicked. */
  link: string;
}
