import { Component, QueryList, ViewChildren } from '@angular/core';

import { Store } from '@ngrx/store';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SectionModelComponent } from '../section.model';
import { SubmissionState } from '../../submission.reducers';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-section-form',
  styleUrls: ['./section-form.component.scss'],
  templateUrl: './section-form.component.html',
})
export class FormSectionComponent extends SectionModelComponent {

  public formId;
  public formModel: DynamicFormControlModel[];
  public isLoading = true;

  @ViewChildren('formRef') private forms: QueryList<FormComponent>;

  public formRef: FormComponent;

  constructor(private formBuilderService: FormBuilderService,
              private formService: FormService,
              private formConfigService: SubmissionFormsConfigService,
              private store:Store<SubmissionState>
              ) {
    super();
  }

  ngOnInit() {
    this.formConfigService.getConfigByHref(this.sectionData.config)
      .flatMap((config: SubmissionFormsModel[]) => config)
      .subscribe((config) => {
        this.formId = this.sectionData.id;
        this.formBuilderService.setAuthorityUuid(this.sectionData.collectionId);
        this.formModel = this.formBuilderService.modelFromConfiguration(config);
      });
  }

  ngAfterViewInit() {
    this.forms.changes.subscribe((comps: QueryList <FormComponent>) => {
      this.formRef = comps.first;
      if (hasValue(this.formRef)) {
        this.formService.isValid(this.formRef.getFormUniqueId())
          .debounceTime(1)
          .subscribe((formState) => {
            this.isLoading = false;
            this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId, this.sectionData.id, formState));
          });
      }
    });
  }
}
