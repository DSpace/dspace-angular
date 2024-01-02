import { Component, Inject } from '@angular/core';
import {  SEARCH_CONFIG_SERVICE } from "../../../my-dspace-page/my-dspace-page.component";
import { AdminNotifyLogsConfigurationService } from "./admin-notify-logs-configuration.service";
import { SearchConfigurationService } from "../../../core/shared/search/search-configuration.service";
import { Context } from "../../../core/shared/context.model";

@Component({
  selector: 'ds-admin-notify-logs',
  templateUrl: './admin-notify-logs.component.html',
  styleUrls: ['./admin-notify-logs.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: AdminNotifyLogsConfigurationService
    }
  ]
})
export class AdminNotifyLogsComponent {
    constructor(@Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService) {
    }

  protected readonly context = Context.Search;
}
