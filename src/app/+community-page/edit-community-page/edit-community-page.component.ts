import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Observable } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { isNotUndefined } from '../../shared/empty.util';
import { first, map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-edit-community',
  styleUrls: ['./edit-community-page.component.scss'],
  templateUrl: './edit-community-page.component.html'
})
export class EditCommunityPageComponent {

  public parentUUID$: Observable<string>;
  public parentRD$: Observable<RemoteData<Community>>;
  public communityRD$: Observable<RemoteData<Community>>;

  public constructor(
    private communityDataService: CommunityDataService,
    private routeService: RouteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.communityRD$ = this.route.data.pipe(first(), map((data) => data.community));
  }

  onSubmit(community: Community) {
    this.communityDataService.update(community)
      .pipe(getSucceededRemoteData())
      .subscribe((communityRD: RemoteData<Community>) => {
        if (isNotUndefined(communityRD)) {
          const newUUID = communityRD.payload.uuid;
          this.router.navigate(['/communities/' + newUUID]);
        }
      });
  }
}
