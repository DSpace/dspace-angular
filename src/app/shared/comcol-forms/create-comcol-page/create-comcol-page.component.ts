import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ComColDataService } from '../../../core/data/comcol-data.service';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RouteService } from '../../../core/services/route.service';
import { Community } from '../../../core/shared/community.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { ResourceType } from '../../../core/shared/resource-type';
import { hasValue, isNotEmpty, isNotUndefined } from '../../empty.util';
import { NotificationsService } from '../../notifications/notifications.service';

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

  /**
   * The UUID of the newly created object
   */
  private newUUID: string;

  /**
   * The type of the dso
   */
  protected type: ResourceType;

  public constructor(
    protected dsoDataService: ComColDataService<TDomain>,
    protected parentDataService: CommunityDataService,
    protected routeService: RouteService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
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
   * Creates a new DSO based on the submitted user data and navigates to the new object's home page
   * @param event   The event returned by the community/collection form. Contains the new dso and logo uploader
   */
  onSubmit(event) {
    const dso = event.dso;
    const uploader = event.uploader;

    this.parentUUID$.pipe(take(1)).subscribe((uuid: string) => {
      this.dsoDataService.create(dso, uuid)
        .pipe(getSucceededRemoteData())
        .subscribe((dsoRD: RemoteData<TDomain>) => {
          if (isNotUndefined(dsoRD)) {
            this.newUUID = dsoRD.payload.uuid;
            if (uploader.queue.length > 0) {
              this.dsoDataService.getLogoEndpoint(this.newUUID).pipe(take(1)).subscribe((href: string) => {
                uploader.options.url = href;
                uploader.uploadAll();
              });
            } else {
              this.navigateToNewPage();
            }
            this.notificationsService.success(null, this.translate.get(this.type.value + '.create.notifications.success'));
          }
        });
    });
  }

  /**
   * Navigate to the page of the newly created object
   */
  navigateToNewPage() {
    if (hasValue(this.newUUID)) {
      this.router.navigate([this.frontendURL + this.newUUID]);
    }
  }

}
