/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE_ATMIRE and NOTICE_ATMIRE files at the root of the source
 * tree and available online at
 *
 * https://www.atmire.com/software-license/
 */
import {
  NgFor,
  NgIf,
} from '@angular/common';
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
  imports: [NgIf, SidebarDropdownComponent, NgFor, FormsModule, PageSizeSelectorComponent, TranslateModule],
})

export class SearchSettingsComponent extends BaseComponent {}
