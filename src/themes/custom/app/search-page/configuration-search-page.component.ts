import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../app/my-dspace-page/my-dspace-page.component';
import { ConfigurationSearchPageComponent as BaseComponent } from '../../../../app/search-page/configuration-search-page.component';
import { pushInOut } from '../../../../app/shared/animations/push';

@Component({
  selector: 'ds-configuration-search-page',
  // styleUrls: ['./configuration-search-page.component.scss'],
  styleUrls: ['../../../../app/shared/search/search.component.scss'],
  // templateUrl: './configuration-search-page.component.html'
  templateUrl: '../../../../app/shared/search/search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
})

/**
 * This component renders a search page using a configuration as input.
 */
export class ConfigurationSearchPageComponent extends BaseComponent {}

