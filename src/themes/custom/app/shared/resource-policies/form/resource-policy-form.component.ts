import { Component } from '@angular/core';
import { ResourcePolicyFormComponent as BaseComponent } from '../../../../../../app/shared/resource-policies/form/resource-policy-form.component';

/**
 * Component that show form for adding/editing a resource policy
 */
@Component({
  selector: 'ds-resource-policy-form',
  // templateUrl: './resource-policy-form.component.html'
  templateUrl: '../../../../../../app/shared/resource-policies/form/resource-policy-form.component.html'
})
export class ResourcePolicyFormComponent extends BaseComponent {
}
