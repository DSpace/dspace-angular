import { Component } from '@angular/core';
import { BrowseByTaxonomyPageComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component';

@Component({
  selector: 'ds-browse-by-taxonomy-page',
  // templateUrl: './browse-by-taxonomy-page.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component.html',
  // styleUrls: ['./browse-by-taxonomy-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component.scss'],
})
/**
 * Component for browsing items by metadata in a hierarchical controlled vocabulary
 */
export class BrowseByTaxonomyPageComponent extends BaseComponent {
}
