import { Component } from '@angular/core';

import { AdminSearchPageComponent as BaseComponent } from '../../../../../app/admin/admin-search-page/admin-search-page.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../../app/search-page/themed-configuration-search-page.component';

@Component({
  selector: 'ds-themed-admin-search-page',
  // styleUrls: ['./admin-search-page.component.scss'],
  styleUrls: ['../../../../../app/admin/admin-search-page/admin-search-page.component.scss'],
  // templateUrl: './admin-search-page.component.html',
  templateUrl: '../../../../../app/admin/admin-search-page/admin-search-page.component.html',
  standalone: true,
  imports: [
    ThemedConfigurationSearchPageComponent,
  ],
})
export class AdminSearchPageComponent extends BaseComponent {
}
