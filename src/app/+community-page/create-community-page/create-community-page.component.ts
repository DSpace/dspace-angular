import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { ComColDataService } from '../../core/data/comcol-data.service';
import { NormalizedCommunity } from '../../core/cache/models/normalized-community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { DSOSuccessResponse, ErrorResponse, RestResponse } from '../../core/cache/response-cache.models';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent {

  private error$: Observable<ErrorResponse>;
  private parentUUID$: Observable<string>;
  private communityRDObs: Observable<RemoteData<Community>>;

  public constructor(private communityDataService: CommunityDataService, private routeService: RouteService, private router: Router) {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((uuid: string) => {
      this.communityRDObs = this.communityDataService.findById(uuid);
    });
  }

  onSubmit(data: any) {
    const community = Object.assign(new Community(), {
      name: data.name
    });
    this.parentUUID$.subscribe((uuid: string) => {
      let response$: Observable<ResponseCacheEntry>;
      if (uuid) {
        response$ = this.communityDataService.create(community, uuid);
      } else {
        response$ = this.communityDataService.create(community);
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
