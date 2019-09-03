import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions
} from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { BrowseService } from '../../core/browse/browse.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { BrowseByType, rendersBrowseBy } from '../+browse-by-switcher/browse-by-decorator';

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['../+browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../+browse-by-metadata-page/browse-by-metadata-page.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
@rendersBrowseBy(BrowseByType.Title)
export class BrowseByTitlePageComponent extends BrowseByMetadataPageComponent {

  public constructor(protected route: ActivatedRoute,
                     protected browseService: BrowseService,
                     protected dsoService: DSpaceObjectDataService,
                     protected router: Router) {
    super(route, browseService, dsoService, router);
  }

  ngOnInit(): void {
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
    this.subs.push(
      observableCombineLatest(
        this.route.params,
        this.route.queryParams,
        this.route.data,
        (params, queryParams, data ) => {
          return Object.assign({}, params, queryParams, data);
        })
        .subscribe((params) => {
          this.browseId = params.id || this.defaultBrowseId;
          this.updatePageWithItems(browseParamsToOptions(params, this.paginationConfig, this.sortConfig, this.browseId), undefined);
          this.updateParent(params.scope)
        }));
    this.updateStartsWithTextOptions();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
