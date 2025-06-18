import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { ComColDataService } from '../../../../../core/data/comcol-data.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Collection } from '../../../../../core/shared/collection.model';
import { Community } from '../../../../../core/shared/community.model';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
} from '../../../../../core/shared/operators';
import { ResourceType } from '../../../../../core/shared/resource-type';
import { isEmpty } from '../../../../empty.util';
import { NotificationsService } from '../../../../notifications/notifications.service';

@Component({
  selector: 'ds-comcol-metadata',
  template: '',
  standalone: true,
})
export class ComcolMetadataComponent<TDomain extends Community | Collection> implements OnInit {
  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;
  /**
   * Frontend endpoint for this type of DSO
   */
  protected frontendURL: string;
  /**
   * The type of the dso
   */
  protected type: ResourceType;

  public constructor(
    protected dsoDataService: ComColDataService<TDomain>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(map((data) => data.dso));
  }

  /**
   * Updates an existing DSO based on the submitted user data and navigates to the edited object's home page
   * @param event   The event returned by the community/collection form. Contains the new dso and logo uploader
   */
  onSubmit(event) {
    if (!isEmpty(event.operations)) {
      this.dsoDataService.patch(event.dso, event.operations).pipe(getFirstCompletedRemoteData())
        .subscribe( (response: RemoteData<DSpaceObject>) => {
          if (response.hasSucceeded) {
            this.router.navigate([this.frontendURL, event.dso.uuid]);  // todo: ok not to await this?
            this.notificationsService.success(null, this.translate.get(`${this.type.value}.edit.notifications.success`));
          } else if (response.statusCode === 403) {
            this.notificationsService.error(null, this.translate.get(`${this.type.value}.edit.notifications.unauthorized`));
          } else {
            this.notificationsService.error(null, this.translate.get(`${this.type.value}.edit.notifications.error`));
          }
        });
    } else {
      this.router.navigate([this.frontendURL, event.dso.uuid]);
    }
  }

  /**
   * Navigate to the relative DSO page
   */
  navigateToHomePage() {
    this.dsoRD$.pipe(
      getFirstSucceededRemoteData(),
      take(1),
    ).subscribe((dsoRD: RemoteData<TDomain>) => {
      this.router.navigate([this.frontendURL + dsoRD.payload.id]);
    });
  }
}
