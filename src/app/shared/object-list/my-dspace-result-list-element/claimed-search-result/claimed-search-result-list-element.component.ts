import { Component } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedTaskSearchResult } from '../../../object-collection/shared/claimed-task-search-result.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { AbstractClaimedSearchResultListElementComponent } from './abstract-claimed-search-result-list-element.component';

@Component({
  selector: 'ds-claimed-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-search-result-list-element.component.html',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.ListElement)
export class ClaimedSearchResultListElementComponent extends AbstractClaimedSearchResultListElementComponent {

  constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService
  ) {
    super(linkService, truncatableService);
  }

}
