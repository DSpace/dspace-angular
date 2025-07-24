import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SearchConfigurationService } from '../../../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../app/my-dspace-page/my-dspace-configuration.service';
import { PageSizeSelectorComponent } from '../../../../../../app/shared/page-size-selector/page-size-selector.component';
import { SearchSettingsComponent as BaseComponent } from '../../../../../../app/shared/search/search-settings/search-settings.component';
import { SidebarDropdownComponent } from '../../../../../../app/shared/sidebar/sidebar-dropdown.component';

@Component({
  selector: 'ds-themed-search-settings',
  // styleUrls: ['./search-settings.component.scss'],
  styleUrls: ['../../../../../../app/shared/search/search-settings/search-settings.component.scss'],
  // templateUrl: './search-settings.component.html',
  templateUrl: '../../../../../../app/shared/search/search-settings/search-settings.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [
    FormsModule,
    PageSizeSelectorComponent,
    SidebarDropdownComponent,
    TranslateModule,
  ],
})
export class SearchSettingsComponent extends BaseComponent {
}
