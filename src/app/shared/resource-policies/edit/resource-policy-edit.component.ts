import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, take } from 'rxjs/operators';

import { ResourcePolicyService } from '../../../core/resource-policy/resource-policy.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RemoteData } from '../../../core/data/remote-data';
import { ResourcePolicy } from '../../../core/resource-policy/models/resource-policy.model';
import { ResourcePolicyEvent } from '../form/resource-policy-form';
import { ITEM_EDIT_AUTHORIZATIONS_PATH } from '../../../+item-page/edit-item-page/edit-item-page.routing.module';

@Component({
  selector: 'ds-resource-policy-edit',
  templateUrl: './resource-policy-edit.component.html'
})
export class ResourcePolicyEditComponent implements OnInit {

  /**
   * The resource policy object to edit
   */
  public resourcePolicy: ResourcePolicy;

  constructor(
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
      this.resourcePolicy = (data.resourcePolicy as RemoteData<ResourcePolicy>).payload;
      console.log(data)
    });
  }

  redirectToAuthorizationsPage() {
    this.router.navigate([`../../${ITEM_EDIT_AUTHORIZATIONS_PATH}`], { relativeTo: this.route });
  }

  updateResourcePolicy(event: ResourcePolicyEvent) {
    const updatedObject = Object.assign({}, event.object, {
      _links: this.resourcePolicy._links
    });
    this.resourcePolicyService.update(updatedObject).pipe(
      first((response: RemoteData<ResourcePolicy>) => !response.isResponsePending)
    ).subscribe((responseRD: RemoteData<ResourcePolicy>) => {
      if (responseRD.hasSucceeded) {
        this.notificationsService.success(null, 'resource-policies.edit.page.success.content');
        this.redirectToAuthorizationsPage();
      } else {
        this.notificationsService.error(null, 'resource-policies.edit.page.failure.content');
      }
    })
  }
}
