import { Component, Input } from '@angular/core';
import {
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { ResourceType } from '../../core/shared/resource-type';
import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../comcol-forms/comcol-form/comcol-form.component';

@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../comcol-forms/comcol-form.component.scss'],
  templateUrl: '../../comcol-forms/comcol-form/comcol-form.component.html'
})
export class CollectionFormComponent extends ComColFormComponent<Collection> {
  @Input() dso: Collection = new Collection();
  type = ResourceType.Collection;
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
    new DynamicTextAreaModel({
      id: 'license',
      name: 'dc.rights.license',
    }),
    new DynamicTextAreaModel({
      id: 'provenance',
      name: 'dc.description.provenance',
    }),
  ];
}
