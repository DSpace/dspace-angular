import { Component } from '@angular/core';
import {
  BrowseByTaxonomyPageComponent as BaseComponent
} from '../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component';
import {
  VocabularyTreeviewComponent
} from '../../../../../app/shared/form/vocabulary-treeview/vocabulary-treeview.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-browse-by-taxonomy-page',
  // templateUrl: './browse-by-taxonomy-page.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component.html',
  // styleUrls: ['./browse-by-taxonomy-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-taxonomy-page/browse-by-taxonomy-page.component.scss'],
  standalone: true,
  imports: [
    VocabularyTreeviewComponent,
    RouterLink,
    TranslateModule
  ],
})
/**
 * Component for browsing items by metadata in a hierarchical controlled vocabulary
 */
export class BrowseByTaxonomyPageComponent extends BaseComponent {
}
