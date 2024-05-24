import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FormModule } from '../form/form.module';
import { SharedModule } from '../shared.module';
import { ResourcePolicyCreateComponent } from './create/resource-policy-create.component';
import { ResourcePolicyEditComponent } from './edit/resource-policy-edit.component';
import { ResourcePolicyEntryComponent } from './entry/resource-policy-entry.component';
import { ResourcePolicyFormComponent } from './form/resource-policy-form.component';
import { ResourcePolicyResolver } from './resolvers/resource-policy.resolver';
import { ResourcePolicyTargetResolver } from './resolvers/resource-policy-target.resolver';
import { ResourcePoliciesComponent } from './resource-policies.component';

const COMPONENTS = [
  ResourcePoliciesComponent,
  ResourcePolicyEntryComponent,
  ResourcePolicyFormComponent,
  ResourcePolicyEditComponent,
  ResourcePolicyCreateComponent
];

const PROVIDERS = [
  ResourcePolicyResolver,
  ResourcePolicyTargetResolver,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormModule,
    TranslateModule,
    SharedModule,
  ],
  providers: [
    ...PROVIDERS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class ResourcePoliciesModule { }
