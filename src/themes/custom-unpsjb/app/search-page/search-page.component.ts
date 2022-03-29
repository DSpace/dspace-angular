import { Component } from '@angular/core';
import { SearchPageComponent as BaseComponent } from '../../../../app/search-page/search-page.component';

@Component({
  selector: 'ds-search-page',
  // styleUrls: ['./search-page.component.scss'],
  // templateUrl: './search-page.component.html'
  templateUrl: '../../../../app/search-page/search-page.component.html'
})

/**
 * This component represents the whole search page
 * It renders search results depending on the current search options
 */
export class SearchPageComponent extends BaseComponent {}

