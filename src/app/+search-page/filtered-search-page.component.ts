import { CommunityDataService } from '../core/data/community-data.service';
import { HostWindowService } from '../shared/host-window.service';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchPageComponent } from './search-page.component';
import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { RouteService } from '../shared/services/route.service';
import { SearchConfigurationService } from './search-service/search-configuration.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({selector: 'ds-filtered-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})

export class FilteredSearchPageComponent extends SearchPageComponent {

  constructor(protected service: SearchService,
              protected sidebarService: SearchSidebarService,
              protected windowService: HostWindowService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService) {
    super(service, sidebarService, windowService, filterService, searchConfigService);
  }

}
