import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, take } from 'rxjs/operators';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ResourcePolicyService } from '../../../core/resource-policy/resource-policy.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RemoteData } from '../../../core/data/remote-data';
import { ResourcePolicy } from '../../../core/resource-policy/models/resource-policy.model';
import { ResourcePolicyEvent } from '../form/resource-policy-form';
import { ITEM_EDIT_AUTHORIZATIONS_PATH } from '../../../+item-page/edit-item-page/edit-item-page.routing.module';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-resource-policy-create',
  templateUrl: './resource-policy-create.component.html'
})
export class ResourcePolicyCreateComponent implements OnInit {

  /**
   * The uuid of the resource target of the policy
   */
  private targetResourceUUID: string;

  public targetResourceName: string;

  constructor(
    private dsoNameService: DSONameService,
    private notificationsService: NotificationsService,
    private resourcePolicyService: ResourcePolicyService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data),
      take(1)
    ).subscribe((data: any) => {
      this.targetResourceUUID = (data.resourcePolicyTarget as RemoteData<DSpaceObject>).payload.id;
      this.targetResourceName = this.dsoNameService.getName((data.resourcePolicyTarget as RemoteData<DSpaceObject>).payload);
    });
  }

  redirectToAuthorizationsPage() {
    this.router.navigate([`../../${ITEM_EDIT_AUTHORIZATIONS_PATH}`], { relativeTo: this.route });
  }

  createResourcePolicy(event: ResourcePolicyEvent) {
    let response$;
    if (event.target.type === 'eperson') {
      response$ = this.resourcePolicyService.create(event.object, this.targetResourceUUID, event.target.uuid);
    } else {
      response$ = this.resourcePolicyService.create(event.object, this.targetResourceUUID, null, event.target.uuid);
    }
    response$.pipe(
      first((response: RemoteData<ResourcePolicy>) => !response.isResponsePending)
    ).subscribe((responseRD: RemoteData<ResourcePolicy>) => {
      if (responseRD.hasSucceeded) {
        this.notificationsService.success(null, 'resource-policies.create.page.success.content');
        this.redirectToAuthorizationsPage();
      } else {
        this.notificationsService.error(null, 'resource-policies.create.page.failure.content');
      }
    })
  }

}
