import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { ResourcePolicyService } from '../../../core/resource-policy/resource-policy.service';
import { PaginatedList } from '../../../core/data/paginated-list';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { Bundle } from '../../../core/shared/bundle.model';

@Component({
  selector: 'ds-item-authorizations',
  templateUrl: './item-authorizations.component.html'
})
/**
 * Component that handles the item Authorizations
 */
export class ItemAuthorizationsComponent implements OnInit {

  private bundles$: Observable<RemoteData<PaginatedList<Bundle>>>;
  private item$: Observable<Item>;

  constructor(
    private linkService: LinkService,
    private resourcePolicyService: ResourcePolicyService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.item$ = this.route.data.pipe(
      map((data) => data.item),
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => this.linkService.resolveLink(item, followLink('bundles')))
    ) as Observable<Item>;

    this.bundles$ = this.item$.pipe(flatMap((item: Item) => item.bundles));

  }

}
