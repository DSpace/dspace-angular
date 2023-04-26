import { Component, OnInit } from '@angular/core';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';

@Component({
  selector: 'ds-browse-by-taxonomy-page',
  templateUrl: './browse-by-taxonomy-page.component.html',
  styleUrls: ['./browse-by-taxonomy-page.component.scss']
})
/**
 * Component for browsing items by metadata in a hierarchical controlled vocabulary
 */
export class BrowseByTaxonomyPageComponent implements OnInit {

  /**
   * The {@link VocabularyOptions} object
   */
  vocabularyOptions: VocabularyOptions;

  /**
   * The selected vocabulary entries
   */
  selectedItems: VocabularyEntryDetail[] = [];

  /**
   * The query parameters, contain the selected entries
   */
  queryParams: { 'f.subject': string[] };

  ngOnInit() {
    this.vocabularyOptions = { name: 'srsc', closed: true };
  }

  onSelect(detail: VocabularyEntryDetail): void {
    this.selectedItems.push(detail);
    const filterValues = this.selectedItems
      .map((item: VocabularyEntryDetail) => `${item.value},equals`);
    this.queryParams = { 'f.subject': filterValues };
  }
}
