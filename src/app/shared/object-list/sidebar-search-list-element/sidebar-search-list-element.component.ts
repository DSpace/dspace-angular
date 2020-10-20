import { SearchResult } from '../../search/search-result.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { SearchResultListElementComponent } from '../search-result-list-element/search-result-list-element.component';
import { Component } from '@angular/core';
import { hasValue } from '../../empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { LinkService } from '../../../core/cache/builders/link.service';
import { find, map } from 'rxjs/operators';
import { ChildHALResource } from '../../../core/shared/child-hal-resource.model';
import { followLink } from '../../utils/follow-link-config.model';
import { RemoteData } from '../../../core/data/remote-data';

@Component({
  selector: 'ds-sidebar-search-list-element',
  templateUrl: './sidebar-search-list-element.component.html'
})
export class SidebarSearchListElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends SearchResultListElementComponent<T, K> {
  parentTitle$: Observable<string>;
  title: string;
  description: string;

  public constructor(protected truncatableService: TruncatableService,
                     protected linkService: LinkService) {
    super(truncatableService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (hasValue(this.dso)) {
      this.parentTitle$ = this.getParentTitle();
      this.title = this.getTitle();
      this.description = this.getDescription();
    }
  }

  getTitle(): string {
    return this.firstMetadataValue('dc.title');
  }

  getDescription(): string {
    // TODO: Expand description
    return this.firstMetadataValue('dc.publisher');
  }

  getParentTitle(): Observable<string> {
    // TODO: Remove cast to "any" and replace with proper type-check
    const propertyName = (this.dso as any).getParentLinkKey();
    return this.linkService.resolveLink(this.dso, followLink(propertyName))[propertyName].pipe(
      find((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => parentRD.hasSucceeded || parentRD.statusCode === 204),
      map((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        return parentRD.payload.firstMetadataValue('dc.title');
      })
    );
  }
}
