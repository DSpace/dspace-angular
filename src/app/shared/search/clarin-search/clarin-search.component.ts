import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { SearchComponent } from '../search.component';
import { SearchService } from '../../../core/shared/search/search.service';
import { SidebarService } from '../../sidebar/sidebar.service';
import { HostWindowService } from '../../host-window.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { RouteService } from '../../../core/services/route.service';
import { Router } from '@angular/router';
import { pushInOut } from '../../animations/push';

/**
 * This component was created because we customized search item boxes and they was used in the `/mydspace` as well.
 */
@Component({
  selector: 'ds-clarin-search',
  templateUrl: './clarin-search.component.html',
  styleUrls: ['./clarin-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
})
export class ClarinSearchComponent extends SearchComponent implements OnInit {

  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router) {
    super(service, sidebarService, windowService, searchConfigService, routeService, router);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
