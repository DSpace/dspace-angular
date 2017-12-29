import { Component, Input, OnInit } from '@angular/core';
import { DynamicGroupModel } from './dynamic-group.model';
import { FormGroup } from '@angular/forms';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';

@Component({
  selector: 'ds-dynamic-group',
  templateUrl: './dynamic-group.component.html',
})
export class DsDynamicGroupComponent implements OnInit {

  public formModel: DynamicFormControlModel[];

  @Input() formId: string;
  @Input() model: DynamicGroupModel;
  @Input() group: FormGroup;

  constructor(private formBuilderService: FormBuilderService) {
  }

  ngOnInit() {
    const config = { rows: this.model.formConfiguration } as SubmissionFormsModel;

    this.formModel = this.formBuilderService.modelFromConfiguration(config, {});
  }

  onBlur(event) {
  }

  onChange(event) {
  }

  onFocus(event) {
  }

  onRemoveItem(event) {
  }

  onAddItem(event) {
  }

}
