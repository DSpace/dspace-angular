import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { rendersBrowseBy } from '../browse-by-switcher/browse-by-decorator';
import { map } from 'rxjs/operators';
import { HierarchicalBrowseDefinition } from '../../core/shared/hierarchical-browse-definition.model';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';
import { Context } from '../../core/shared/context.model';

@Component({
  selector: 'ds-browse-by-taxonomy-page',
  templateUrl: './browse-by-taxonomy-page.component.html',
  styleUrls: ['./browse-by-taxonomy-page.component.scss']
})
/**
 * Component for browsing items by metadata in a hierarchical controlled vocabulary
 */
@rendersBrowseBy(BrowseByDataType.Hierarchy)
export class BrowseByTaxonomyPageComponent implements OnInit, OnDestroy {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The {@link BrowseByDataType} of this Component
   */
  @Input() browseByType: BrowseByDataType;

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

  /**
   * The facet the use when filtering
   */
  facetType: string;

  /**
   * The used vocabulary
   */
  vocabularyName: string;

  /**
   * The parameters used in the URL
   */
  queryParams: any;

  /**
   * Resolved browse-by definition
   */
  browseDefinition$: Observable<BrowseDefinition>;

  /**
   * Subscriptions to track
   */
  subs: Subscription[] = [];

  public constructor(
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.browseDefinition$ = this.route.data.pipe(
      map((data: { browseDefinition: BrowseDefinition }) => {
        return data.browseDefinition;
      })
    );
    this.subs.push(this.browseDefinition$.subscribe((browseDefinition: HierarchicalBrowseDefinition) => {
      this.facetType = browseDefinition.facetType;
      this.vocabularyName = browseDefinition.vocabulary;
      this.vocabularyOptions = { name: this.vocabularyName, closed: true };
    }));
  }

  /**
   * Adds detail to selectedItems, transforms it to be used as query parameter
   * and adds that to filterValues.
   *
   * @param detail VocabularyEntryDetail to be added
   */
  onSelect(detail: VocabularyEntryDetail): void {
      this.selectedItems.push(detail);
      this.filterValues = this.selectedItems
        .map((item: VocabularyEntryDetail) => `${item.value},equals`);
    this.updateQueryParams();
  }

  /**
   * Removes detail from selectedItems and filterValues.
   *
   * @param detail VocabularyEntryDetail to be removed
   */
  onDeselect(detail: VocabularyEntryDetail): void {
    this.selectedItems = this.selectedItems.filter((entry: VocabularyEntryDetail) => { return entry.id !== detail.id; });
    this.filterValues = this.filterValues.filter((value: string) => { return value !== `${detail.value},equals`; });
    this.updateQueryParams();
  }

  /**
   * Updates queryParams based on the current facetType and filterValues.
   */
  private updateQueryParams(): void {
    this.queryParams = {
      ['f.' + this.facetType]: this.filterValues
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
