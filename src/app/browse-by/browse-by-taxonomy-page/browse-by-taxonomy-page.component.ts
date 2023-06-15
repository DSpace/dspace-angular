import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { BROWSE_BY_COMPONENT_FACTORY } from '../browse-by-switcher/browse-by-decorator';
import { map } from 'rxjs/operators';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';
import { HierarchicalBrowseDefinition } from '../../core/shared/hierarchical-browse-definition.model';

@Component({
  selector: 'ds-browse-by-taxonomy-page',
  templateUrl: './browse-by-taxonomy-page.component.html',
  styleUrls: ['./browse-by-taxonomy-page.component.scss']
})
/**
 * Component for browsing items by metadata in a hierarchical controlled vocabulary
 */
export class BrowseByTaxonomyPageComponent implements OnInit, OnDestroy {

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
   * Resolved browse-by component
   */
  browseByComponent: Observable<any>;

  /**
   * Subscriptions to track
   */
  browseByComponentSubs: Subscription[] = [];

  public constructor( protected route: ActivatedRoute,
                      protected themeService: ThemeService,
                      @Inject(BROWSE_BY_COMPONENT_FACTORY) private getComponentByBrowseByType: (browseByType, theme) => GenericConstructor<any>) {
  }

  ngOnInit(): void {
    this.browseByComponent = this.route.data.pipe(
      map((data: { browseDefinition: BrowseDefinition }) => {
        this.getComponentByBrowseByType(data.browseDefinition.getRenderType(), this.themeService.getThemeName());
        return data.browseDefinition;
      })
    );
    this.browseByComponentSubs.push(this.browseByComponent.subscribe((browseDefinition: HierarchicalBrowseDefinition) => {
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
    this.browseByComponentSubs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
