import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { PageSizeSelectorComponent } from '../../../../../../app/shared/page-size-selector/page-size-selector.component';
import { SearchSettingsComponent as BaseComponent } from '../../../../../../app/shared/search/search-settings/search-settings.component';
import { SidebarDropdownComponent } from '../../../../../../app/shared/sidebar/sidebar-dropdown.component';

@Component({
  selector: 'ds-themed-search-settings',
  // styleUrls: ['./search-settings.component.scss'],
  styleUrls: ['../../../../../../app/shared/search/search-settings/search-settings.component.scss'],
  // templateUrl: './search-settings.component.html',
  templateUrl: '../../../../../../app/shared/search/search-settings/search-settings.component.html',
  imports: [
    FormsModule,
    PageSizeSelectorComponent,
    SidebarDropdownComponent,
    TranslateModule,
  ],
})
export class SearchSettingsComponent extends BaseComponent {
}
