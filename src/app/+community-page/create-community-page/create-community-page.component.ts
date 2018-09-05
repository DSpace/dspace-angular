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
import { isNotEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent {

  public error$: Observable<ErrorResponse>;
  public parentUUID$: Observable<string>;
  public communityRDObs: Observable<RemoteData<Community>>;

  public constructor(private communityDataService: CommunityDataService, private routeService: RouteService, private router: Router) {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((uuid: string) => {
      if (isNotEmpty(uuid)) {
        this.communityRDObs = this.communityDataService.findById(uuid);
      }
    });
  }

  onSubmit(data: any) {
    this.parentUUID$.subscribe((uuid: string) => {
      const community = Object.assign(new Community(), {
        name: data.name,
        metadata: [
          { key: 'dc.description', value: data.introductory },
          { key: 'dc.description.abstract', value: data.description },
          { key: 'dc.rights', value: data.copyright }
          // TODO: metadata for news
        ],
        owner: Observable.of(new RemoteData(false, false, true, null, Object.assign(new Community(), {
          id: uuid,
          uuid: uuid
        })))
      });
      this.communityDataService.create(community).subscribe((rd: RemoteData<Community>) => {
        console.log(rd);
        if (rd.hasSucceeded) {
          this.router.navigateByUrl('');
        }
      });
    });
  }

}
