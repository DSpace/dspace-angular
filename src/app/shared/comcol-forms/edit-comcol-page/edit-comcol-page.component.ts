import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../core/data/remote-data';
import { isNotUndefined } from '../../empty.util';
import { first, map, take } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { DataService } from '../../../core/data/data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ComColDataService } from '../../../core/data/comcol-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ResourceType } from '../../../core/shared/resource-type';

/**
 * Component representing the edit page for communities and collections
 */
@Component({
  selector: 'ds-edit-comcol',
  template: ''
})
export class EditComColPageComponent<TDomain extends DSpaceObject> implements OnInit {
  /**
   * Frontend endpoint for this type of DSO
   */
  protected frontendURL: string;
  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  /**
   * The type of the dso
   */
  protected type: ResourceType;

  public constructor(
    protected dsoDataService: ComColDataService<TDomain>,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.dsoRD$ = this.route.data.pipe(first(), map((data) => data.dso));
  }

  /**
   * Updates an existing DSO based on the submitted user data and navigates to the edited object's home page
   * @param event   The event returned by the community/collection form. Contains the new dso and logo uploader
   */
  onSubmit(event) {
    const dso = event.dso;
    const uploader = event.uploader;

    this.dsoDataService.update(dso)
      .pipe(getSucceededRemoteData())
      .subscribe((dsoRD: RemoteData<TDomain>) => {
        if (isNotUndefined(dsoRD)) {
          const newUUID = dsoRD.payload.uuid;
          if (uploader.queue.length > 0) {
            this.dsoDataService.getLogoEndpoint(newUUID).pipe(take(1)).subscribe((href: string) => {
              uploader.options.url = href;
              uploader.uploadAll();
            });
          } else {
            this.router.navigate([this.frontendURL + newUUID]);
          }
          this.notificationsService.success(null, this.translate.get(this.type.value + '.edit.notifications.success'));
        }
      });
  }

  /**
   * Navigate to the home page of the object
   */
  navigateToHomePage() {
    this.dsoRD$.pipe(
      getSucceededRemoteData(),
      take(1)
    ).subscribe((dsoRD: RemoteData<TDomain>) => {
      this.router.navigate([this.frontendURL + dsoRD.payload.id]);
    });
  }
}
