import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { isNotEmpty } from '../../../../shared/empty.util';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'ds-related-entities-search',
  templateUrl: './related-entities-search.component.html'
})
/**
 * A component to show related items as search results.
 * Related items can be facetted, or queried using an
 * optional search box.
 */
export class RelatedEntitiesSearchComponent implements OnInit {

  /**
   * The type of relationship to fetch items for
   * e.g. 'isAuthorOfPublication'
   */
  @Input() relationType: string;

  /**
   * The item to render relationships for
   */
  @Input() item: Item;

  /**
   * The entity type of the relationship items to be displayed
   * e.g. 'publication'
   * This determines the title of the search results (if search is enabled)
   */
  @Input() relationEntityType: string;

  /**
   * Whether or not the search bar and title should be displayed (defaults to true)
   * @type {boolean}
   */
  @Input() searchEnabled = true;

  /**
   * The ratio of the sidebar's width compared to the search results (1-12) (defaults to 4)
   * @type {number}
   */
  @Input() sideBarWidth = 4;

  fixedFilter: string;
  configuration$: Observable<string>;

  constructor(private fixedFilterService: SearchFixedFilterService) {
  }

  ngOnInit(): void {
    if (isNotEmpty(this.relationType) && isNotEmpty(this.item)) {
      this.fixedFilter = this.fixedFilterService.getFilterByRelation(this.relationType, this.item.id);
    }
    if (isNotEmpty(this.relationEntityType)) {
      this.configuration$ = of(this.relationEntityType);
    }
  }

}
