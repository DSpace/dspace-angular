import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { ComColDataService } from '../../core/data/comcol-data.service';
import { NormalizedCommunity } from '../../core/cache/models/normalized-community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { DSOSuccessResponse, ErrorResponse } from '../../core/cache/response-cache.models';
import { Observable } from 'rxjs/Observable';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';

@Component({
  selector: 'ds-create-collection',
  styleUrls: ['./create-collection-page.component.scss'],
  templateUrl: './create-collection-page.component.html'
})
export class CreateCollectionPageComponent {

  private error$: Observable<ErrorResponse>;
  private parentUUID$: Observable<string>;
  private communityRDObs: Observable<RemoteData<Community>>;

  public constructor(private collectionDataService: CollectionDataService, private communityDataService: CommunityDataService, private routeService: RouteService, private router: Router) {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((uuid: string) => {
      this.communityRDObs = this.communityDataService.findById(uuid);
    });
  }

  onSubmit(data: any) {
    const collection = Object.assign(new Collection(), {
      name: data.name,
      metadata: [
        { key: 'dc.description', value: data.introductory },
        { key: 'dc.description.abstract', value: data.description },
        { key: 'dc.rights', value: data.copyright },
        { key: 'dc.rights.license', value: data.license }
        // TODO: metadata for news and provenance
      ]
    });
    this.parentUUID$.subscribe((uuid: string) => {
      let response$: Observable<ResponseCacheEntry>;
      if (uuid) {
        response$ = this.collectionDataService.create(collection, uuid);
      } else {
        response$ = this.collectionDataService.create(collection);
      }
      this.error$ = response$.pipe(
        map((response: ResponseCacheEntry) => {
          if (!response.response.isSuccessful && response.response instanceof ErrorResponse) {
            return response.response;
          } else if (response.response instanceof DSOSuccessResponse) {
            this.router.navigateByUrl('');
          }
        })
      );
    });
  }

}
