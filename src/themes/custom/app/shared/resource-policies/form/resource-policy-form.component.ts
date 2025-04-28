import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormComponent } from 'src/app/shared/form/form.component';

import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { EpersonGroupListComponent } from '../../../../../../app/shared/eperson-group-list/eperson-group-list.component';
import { ResourcePolicyFormComponent as BaseComponent } from '../../../../../../app/shared/resource-policies/form/resource-policy-form.component';

@Component({
  selector: 'ds-themed-resource-policy-form',
  // templateUrl: './resource-policy-form.component.html'
  templateUrl: '../../../../../../app/shared/resource-policies/form/resource-policy-form.component.html',
  imports: [
    FormComponent,
    NgbNavModule,
    EpersonGroupListComponent,
    TranslateModule,
    AsyncPipe,
    BtnDisabledDirective,
  ],
  standalone: true,
})
export class ResourcePolicyFormComponent extends BaseComponent {
}
