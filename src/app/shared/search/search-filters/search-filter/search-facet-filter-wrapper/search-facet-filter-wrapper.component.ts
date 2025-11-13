import {
  Component,
  Input,
} from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
import { BehaviorSubject } from 'rxjs';

import { AbstractComponentLoaderComponent } from '../../../../abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../../../abstract-component-loader/dynamic-component-loader.directive';
import { renderFilterType } from '../search-filter-type-decorator';

@Component({
  selector: 'ds-search-facet-filter-wrapper',
  templateUrl: '../../../../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})

/**
 * Wrapper component that renders a specific facet filter based on the filter config's type
 */
export class SearchFacetFilterWrapperComponent extends AbstractComponentLoaderComponent<Component> {

  /**
   * Configuration for the filter of this wrapper component
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * The current scope
   */
  @Input() scope: string;

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'filterConfig',
  ];

  protected inputNames: (keyof this & string)[] = [
    'filterConfig',
    'inPlaceSearch',
    'refreshFilters',
    'scope',
  ];

  public getComponent(): GenericConstructor<Component> {
    return renderFilterType(this.filterConfig.filterType);
  }

}
