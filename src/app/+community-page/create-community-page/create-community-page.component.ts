import { Component, OnInit } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Observable } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { isNotEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { map, take } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent implements OnInit {

  public parentUUID$: Observable<string>;
  public parentRD$: Observable<RemoteData<Community>>;

  public constructor(
    private communityDataService: CommunityDataService,
    private routeService: RouteService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((parentID: string) => {
      if (isNotEmpty(parentID)) {
        this.parentRD$ = this.communityDataService.findById(parentID);
      }
    });
  }

  onSubmit(community: Community) {
    this.parentUUID$.pipe(take(1)).subscribe((uuid: string) => {
      this.communityDataService.create(community, uuid)
        .pipe(getSucceededRemoteData())
        .subscribe((communityRD: RemoteData<Community>) => {
          const newUUID = communityRD.payload.uuid;
          this.router.navigate(['/communities/' + newUUID]);
      });
    });
  }


}
