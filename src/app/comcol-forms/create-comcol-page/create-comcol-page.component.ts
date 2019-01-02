import { Component, OnInit } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Observable } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { take } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DataService } from '../../core/data/data.service';
import { NormalizedDSpaceObject } from '../../core/cache/models/normalized-dspace-object.model';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateComColPageComponent<TDomain extends DSpaceObject, TNormalized extends NormalizedDSpaceObject> implements OnInit {
  protected frontendURL: string;
  public parentUUID$: Observable<string>;
  public parentRD$: Observable<RemoteData<Community>>;

  public constructor(
    protected dsoDataService: DataService<TNormalized, TDomain>,
    protected parentDataService: CommunityDataService,
    protected routeService: RouteService,
    protected router: Router
  ) {

  }

  ngOnInit(): void {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.subscribe((parentID: string) => {
      if (isNotEmpty(parentID)) {
        this.parentRD$ = this.parentDataService.findById(parentID);
      }
    });
  }

  onSubmit(dso: TDomain) {
    this.parentUUID$.pipe(take(1)).subscribe((uuid: string) => {
      this.dsoDataService.create(dso, uuid)
        .pipe(getSucceededRemoteData())
        .subscribe((dsoRD: RemoteData<TDomain>) => {
          if (isNotUndefined(dsoRD)) {
            const newUUID = dsoRD.payload.uuid;
            this.router.navigate([this.frontendURL + newUUID]);
          }
      });
    });
  }

}
