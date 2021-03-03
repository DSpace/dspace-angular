import { Component } from '@angular/core';
import { SearchPageComponent as BaseComponent } from '../../../../app/+search-page/search-page.component';

@Component({
  selector: 'ds-search-page',
  // styleUrls: ['./search-page.component.scss'],
  // templateUrl: './search-page.component.html'
  templateUrl: '../../../../app/+search-page/search-page.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class SearchPageComponent extends BaseComponent {}

