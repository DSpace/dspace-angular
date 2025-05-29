import { Component } from '@angular/core';

import { RelatedEntitiesSearchComponent as BaseComponent } from '../../../../../../../app/item-page/simple/related-entities/related-entities-search/related-entities-search.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../../../../app/search-page/themed-configuration-search-page.component';

@Component({
  selector: 'ds-themed-related-entities-search',
  // templateUrl: './related-entities-search.component.html',
  templateUrl: '../../../../../../../app/item-page/simple/related-entities/related-entities-search/related-entities-search.component.html',
  // styleUrls: ['./related-entities-search.component.scss'],
  imports: [ThemedConfigurationSearchPageComponent],
  standalone: true,
})
export class RelatedEntitiesSearchComponent extends BaseComponent {
}
