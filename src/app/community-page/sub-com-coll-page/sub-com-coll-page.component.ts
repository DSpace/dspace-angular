import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { filter, map, mergeMap } from 'rxjs/operators';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { hasValue } from '../../shared/empty.util';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getFirstSucceededRemoteData } from '../../core/shared/operators';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
@Component({
  selector: 'ds-sub-com-coll-page',
  templateUrl: './sub-com-coll-page.component.html',
  styleUrls: ['./sub-com-coll-page.component.scss']
})
export class SubComCollPageComponent implements OnInit {

  parent$: Observable<RemoteData<DSpaceObject>>;
  logo$: Observable<RemoteData<Bitstream>>;
  constructor(private route: ActivatedRoute,
    protected dsoService: DSpaceObjectDataService,
    public dsoNameService: DSONameService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('id');
      this.updateParent(paramValue);
      this.updateLogo();
    });
  }

  /**
   * Update the parent Community or Collection using their scope
   * @param scope   The UUID of the Community or Collection to fetch
   */
  updateParent(scope: string) {
    if (hasValue(scope)) {
      const linksToFollow = () => {
        return [followLink('logo')];
      };
      this.parent$ = this.dsoService.findById(scope,
        true,
        true,
        ...linksToFollow() as FollowLinkConfig<DSpaceObject>[]).pipe(
          getFirstSucceededRemoteData()
        );
    }
  }

  /**
   * Update the parent Community or Collection logo
   */
  updateLogo() {
    if (hasValue(this.parent$)) {
      this.logo$ = this.parent$.pipe(
        map((rd: RemoteData<Collection | Community>) => rd.payload),
        filter((collectionOrCommunity: Collection | Community) => hasValue(collectionOrCommunity.logo)),
        mergeMap((collectionOrCommunity: Collection | Community) => collectionOrCommunity.logo)
      );
    }
  }

}
