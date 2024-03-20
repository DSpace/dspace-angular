import {
  AsyncPipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
} from '@angular/core';
import {
  Params,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { ObjectKeysPipe } from '../../utils/object-keys-pipe';
import { SearchLabelComponent } from './search-label/search-label.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
  standalone: true,
  imports: [NgFor, SearchLabelComponent, AsyncPipe, ObjectKeysPipe],
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent {
  /**
   * Emits the currently active filters
   */
  appliedFilters: Observable<Params>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Initialize the instance variable
   */
  constructor(
    protected router: Router,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
    this.appliedFilters = this.searchConfigService.getCurrentFrontendFilters().pipe(
      map((params) => {
        const labels = {};
        Object.keys(params)
          .forEach((key) => {
            labels[key] = [...params[key].map((value) => value)];
          });
        return labels;
      }),
    );
  }
}
