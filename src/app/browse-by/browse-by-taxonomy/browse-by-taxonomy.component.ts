import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  RouterLink,
} from '@angular/router';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { Context } from '../../core/shared/context.model';
import { HierarchicalBrowseDefinition } from '../../core/shared/hierarchical-browse-definition.model';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { hasValue } from '../../shared/empty.util';
import { VocabularyTreeviewComponent } from '../../shared/form/vocabulary-treeview/vocabulary-treeview.component';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';

@Component({
  selector: 'ds-browse-by-taxonomy',
  templateUrl: './browse-by-taxonomy.component.html',
  styleUrls: ['./browse-by-taxonomy.component.scss'],
  imports: [
    RouterLink,
    TranslatePipe,
    VocabularyTreeviewComponent,
  ],
  standalone: true,
})
/**
 * Component for browsing items by metadata in a hierarchical controlled vocabulary
 */
export class BrowseByTaxonomyComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The {@link BrowseByDataType} of this Component
   */
  @Input() browseByType: BrowseByDataType;

  /**
   * The ID of the {@link Community} or {@link Collection} of the scope to display
   */
  @Input() scope: string;

  /**
   * Display the h1 title in the section
   */
  @Input() displayTitle = true;

  scope$: BehaviorSubject<string> = new BehaviorSubject(undefined);

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
  queryParams: Params;

  /**
   * Resolved browse-by definition
   */
  browseDefinition$: Observable<BrowseDefinition>;

  /**
   * Browse description
   */
  description: string;

  /**
   * Subscriptions to track
   */
  subs: Subscription[] = [];

  public constructor(
    protected route: ActivatedRoute,
    protected translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.browseDefinition$ = this.route.data.pipe(
      map((data: { browseDefinition: BrowseDefinition }) => {
        return data.browseDefinition;
      }),
    );
    this.subs.push(this.browseDefinition$.subscribe((browseDefinition: HierarchicalBrowseDefinition) => {
      this.selectedItems = [];
      this.facetType = browseDefinition.facetType;
      this.vocabularyName = browseDefinition.vocabulary;
      this.vocabularyOptions = { name: this.vocabularyName, closed: true };
      this.description = this.translate.instant(`browse.metadata.${this.vocabularyName}.tree.description`);
    }));
    this.subs.push(this.scope$.subscribe(() => {
      this.updateQueryParams();
    }));
  }

  ngOnChanges(): void {
    this.scope$.next(this.scope);
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
    this.selectedItems = this.selectedItems.filter((entry: VocabularyEntryDetail) => {
      return entry.id !== detail.id;
    });
    this.filterValues = this.filterValues.filter((value: string) => {
      return value !== `${detail.value},equals`;
    });
    this.updateQueryParams();
  }

  /**
   * Updates queryParams based on the current facetType and filterValues.
   */
  updateQueryParams(): void {
    this.queryParams = {
      ['f.' + this.facetType]: this.filterValues,
    };
    if (hasValue(this.scope)) {
      this.queryParams.scope = this.scope;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
