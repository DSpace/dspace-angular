import { Component, Inject } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { Context } from '../../../../core/shared/context.model';
import { AdminNotifySearchConfigurationService } from '../../config/admin-notify-search-configuration.service';
import { FILTER_SEARCH } from '../../admin-notify-dashboard.component';
import { AdminNotifySearchFilterService } from '../../config/admin-notify-filter-service';
import { FILTER_CONFIG } from '../../../../core/shared/search/search-filter.service';
import { AdminNotifySearchFilterConfig } from '../../config/admin-notify-search-filter-config';


@Component({
  selector: 'ds-admin-notify-outgoing',
  templateUrl: './admin-notify-outgoing.component.html',
  styleUrls: ['./admin-notify-outgoing.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: AdminNotifySearchConfigurationService
    },
    {
      provide: FILTER_SEARCH,
      useClass: AdminNotifySearchFilterService
    },
    {
      provide: FILTER_CONFIG,
      useClass: AdminNotifySearchFilterConfig
    }
  ]
})
export class AdminNotifyOutgoingComponent {
  protected readonly context = Context.CoarNotify;

  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: AdminNotifySearchConfigurationService,
              @Inject(FILTER_SEARCH) public searchFilterService: AdminNotifySearchFilterService,
              @Inject(FILTER_CONFIG) public filterConfig: AdminNotifySearchFilterConfig) {
    const outgoingPrefix = 'outgoing.f';
    this.searchConfigService.setParamPrefix(outgoingPrefix);
    this.searchFilterService.setParamPrefix(outgoingPrefix);
    this.filterConfig.paramNamePrefix = outgoingPrefix;
  }
}
