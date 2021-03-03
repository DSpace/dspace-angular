import { Component } from '@angular/core';
import { SearchPageComponent as BaseComponent } from '../../../../app/+search-page/search-page.component';

@Component({
  selector: 'ds-configuration-search-page',
  // styleUrls: ['./configuration-search-page.component.html'],
  // templateUrl: './configuration-search-page.component.html'
  templateUrl: '../../../../app/+search-page/search.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class ConfigurationSearchPageComponent extends BaseComponent {}

