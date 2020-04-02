import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';

import { ResourcePolicyEvent } from '../form/resource-policy-form';
import { RouteService } from '../../../core/services/route.service';
import { ResourcePolicyService } from '../../../core/resource-policy/resource-policy.service';

@Component({
  selector: 'ds-resource-policy-create',
  templateUrl: './resource-policy-create.component.html'
})
export class ResourcePolicyCreateComponent {

  constructor(
    protected resourcePolicy: ResourcePolicyService,
    protected router: Router,
    protected routeService: RouteService) {
  }

  createResourcePolicy(event: ResourcePolicyEvent) {

  }

  redirectToPreviousPage() {
    this.routeService.getPreviousUrl().pipe(take(1))
      .subscribe((url) => {
        this.router.navigateByUrl(url);
      })
  }
}
