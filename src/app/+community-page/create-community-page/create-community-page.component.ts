import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Observable } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { isNotEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { take } from 'rxjs/operators';
import { ResourceType } from '../../core/shared/resource-type';
import { NormalizedCommunity } from '../../core/cache/models/normalized-community.model';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent {

  public parentUUID$: Observable<string>;
  public communityRDObs: Observable<RemoteData<Community>>;

  public constructor(
    private communityDataService: CommunityDataService,
    private routeService: RouteService,
    private router: Router
  ) {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((uuid: string) => {
      if (isNotEmpty(uuid)) {
        this.communityRDObs = this.communityDataService.findById(uuid);
      }
    });
  }

  onSubmit(data: any) {
    this.parentUUID$.pipe(take(1)).subscribe((uuid: string) => {
      const community = Object.assign(new NormalizedCommunity(), {
        name: data.name,
        metadata: [
          { key: 'dc.description', value: data.introductory },
          { key: 'dc.description.abstract', value: data.description },
          { key: 'dc.rights', value: data.copyright }
          // TODO: metadata for news
        ],
        type: ResourceType.Community
      });
      this.communityDataService.create(community, uuid).pipe(take(1)).subscribe((rd: RemoteData<DSpaceObject>) => {
        if (rd.hasSucceeded) {
          if (uuid) {
            this.router.navigate(['communities', uuid]);
          } else {
            this.router.navigate([]);
          }
        }
      });
    });
  }

}
