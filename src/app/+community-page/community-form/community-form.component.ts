import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import {
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';
import { Community } from '../../core/shared/community.model';
import { ResourceType } from '../../core/shared/resource-type';
import { hasValue, isNotEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-community-form',
  styleUrls: ['./community-form.component.scss'],
  templateUrl: './community-form.component.html'
})
export class CommunityFormComponent implements OnInit {

  @Input() community: Community = new Community();
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      label: 'Name',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      }
    }),
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
      label: 'Introductory text (HTML)',
    }),
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
      label: 'Short Description',
    }),
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
      label: 'Copyright text (HTML)',
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
      label: 'News (HTML)',
    }),
  ];

  formGroup: FormGroup;

  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  public constructor(private location: Location, private formService: DynamicFormService) {
  }

  ngOnInit(): void {
    this.formModel.forEach(
      (fieldModel: DynamicInputModel) => {
        fieldModel.value = this.community.findMetadata(fieldModel.name);
      }
    );
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    const metadata = this.formModel.map(
      (fieldModel: DynamicInputModel) => {
        return { key: fieldModel.name, value: fieldModel.value }
      }
    );
    const filteredOldMetadata = this.community.metadata.filter((filter) => !metadata.map((md) => md.key).includes(filter.key));
    const filteredNewMetadata = metadata.filter((md) => isNotEmpty(md.value));
    const newMetadata = [...filteredOldMetadata, ...filteredNewMetadata];
    const updatedCommunity = Object.assign({}, this.community, {
      metadata: newMetadata,
      type: ResourceType.Community
    });
    this.submitForm.emit(updatedCommunity);
  }

  cancel() {
    this.location.back();
  }
}
