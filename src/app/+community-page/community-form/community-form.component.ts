import { Component, Input, OnInit, Output } from '@angular/core';
import {
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { Community } from '../../core/shared/community.model';
import { ResourceType } from '../../core/shared/resource-type';
import { ComColFormComponent } from '../../comcol-forms/comcol-form/comcol-form.component';

@Component({
  selector: 'ds-community-form',
  styleUrls: ['../../comcol-forms/comcol-form.component.scss'],
  templateUrl: '../../comcol-forms/comcol-form/comcol-form.component.html'
})
export class CommunityFormComponent extends ComColFormComponent<Community> {
  @Input() dso: Community = new Community();
  type = ResourceType.Community;
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
    }),
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
    }),
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
    }),
  ];
}
