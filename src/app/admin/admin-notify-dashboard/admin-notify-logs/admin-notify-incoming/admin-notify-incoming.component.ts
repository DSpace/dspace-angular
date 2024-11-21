import {
  Component,
  Inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { AdminNotifyLogsResultComponent } from '../admin-notify-logs-result/admin-notify-logs-result.component';

@Component({
  selector: 'ds-admin-notify-incoming',
  templateUrl: './admin-notify-incoming.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [
    RouterLink,
    AdminNotifyLogsResultComponent,
    TranslateModule,
  ],
})
export class AdminNotifyIncomingComponent {
  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
  }
}
