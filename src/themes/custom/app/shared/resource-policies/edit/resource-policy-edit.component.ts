import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ResourcePolicyEditComponent as BaseComponent } from '../../../../../../app/shared/resource-policies/edit/resource-policy-edit.component';
import { ResourcePolicyFormComponent } from '../../../../../../app/shared/resource-policies/form/resource-policy-form.component';

@Component({
  selector: 'ds-themed-resource-policy-edit',
  // templateUrl: './resource-policy-edit.component.html'
  templateUrl: '../../../../../../app/shared/resource-policies/edit/resource-policy-edit.component.html',
  standalone: true,
  imports: [ResourcePolicyFormComponent, TranslateModule],
})
export class ResourcePolicyEditComponent extends BaseComponent {
}
