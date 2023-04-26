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
  filterValues: string[];

  ngOnInit() {
    this.vocabularyOptions = { name: 'srsc', closed: true };
  }

  /**
   * Adds detail to selectedItems, transforms it to be used as query parameter
   * and adds that to filterValues. If they already contained the detail,
   * it gets deleted from both arrays.
   *
   * @param detail VocabularyEntryDetail to be added/deleted
   */
  onSelect(detail: VocabularyEntryDetail): void {
    if (!this.selectedItems.includes(detail)) {
      this.selectedItems.push(detail);
      this.filterValues = this.selectedItems
        .map((item: VocabularyEntryDetail) => `${item.value},equals`);
    } else {
      this.selectedItems = this.selectedItems.filter((entry: VocabularyEntryDetail) => { return entry !== detail; });
      this.filterValues = this.filterValues.filter((value: string) => { return value !== `${detail.value},equals`; });
    }
  }
}
