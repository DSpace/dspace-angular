import {Component, OnInit} from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { Observable } from 'rxjs';
import { RouteService } from '../../shared/services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { isNotUndefined } from '../../shared/empty.util';
import { first, map } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { DataService } from '../../core/data/data.service';
import { NormalizedDSpaceObject } from '../../core/cache/models/normalized-dspace-object.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-edit-community',
  styleUrls: ['./edit-community-page.component.scss'],
  templateUrl: './edit-community-page.component.html'
})
export class EditComColPageComponent<TDomain extends DSpaceObject, TNormalized extends NormalizedDSpaceObject> implements OnInit {
  protected frontendURL: string;
  public dsoRD$: Observable<RemoteData<Community>>;

  public constructor(
    protected dsoDataService: DataService<TNormalized, TDomain>,
    private routeService: RouteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.data.pipe(first(), map((data) => data.dso));
  }

  onSubmit(dso: TDomain) {
    this.dsoDataService.update(dso)
      .pipe(getSucceededRemoteData())
      .subscribe((dsoRD: RemoteData<TDomain>) => {
        if (isNotUndefined(dsoRD)) {
          const newUUID = dsoRD.payload.uuid;
          this.router.navigate([this.frontendURL + newUUID]);
        }
      });
  }
}
