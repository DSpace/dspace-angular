import { Component, OnInit } from '@angular/core';
import { Community } from '../../../core/shared/community.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { Observable } from 'rxjs';
import { RouteService } from '../../../core/services/route.service';
import { Router } from '@angular/router';
import { RemoteData } from '../../../core/data/remote-data';
import { isNotEmpty, isNotUndefined } from '../../empty.util';
import { take } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DataService } from '../../../core/data/data.service';

/**
 * Component representing the create page for communities and collections
 */
@Component({
  selector: 'ds-create-comcol',
  template: ''
})
export class CreateComColPageComponent<TDomain extends DSpaceObject> implements OnInit {
  /**
   * Frontend endpoint for this type of DSO
   */
  protected frontendURL: string;

  /**
   * The provided UUID for the parent community
   */
  public parentUUID$: Observable<string>;

  /**
   * The parent community of the object that is to be created
   */
  public parentRD$: Observable<RemoteData<Community>>;

  public constructor(
    protected dsoDataService: DataService<TDomain>,
    protected parentDataService: CommunityDataService,
    protected routeService: RouteService,
    protected router: Router
  ) {

  }

  ngOnInit(): void {
    this.parentUUID$ = this.routeService.getQueryParameterValue('parent');
    this.parentUUID$.pipe(take(1)).subscribe((parentID: string) => {
      if (isNotEmpty(parentID)) {
        this.parentRD$ = this.parentDataService.findById(parentID);
      }
    });
  }

  /**
   * @param {TDomain} dso The updated version of the DSO
   * Creates a new DSO based on the submitted user data and navigates to the new object's home page
   */
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
