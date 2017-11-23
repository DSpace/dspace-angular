import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SectionModelComponent } from '../section.model';
import { CoreState } from '../../../core/core.reducers';
import { Store } from '@ngrx/store';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
import { License } from '../../../core/shared/license.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { FormComponent } from '../../../shared/form/form.component';
import { SECTION_LICENSE_FORM_MODEL } from './section-license.model';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { dateToGMTString } from '../../../shared/date.util';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { FormService } from '../../../shared/form/form.service';
import { SubmissionState } from '../../submission.reducers';

@Component({
  selector: 'ds-submission-section-license',
  styleUrls: ['./section-license.component.scss'],
  templateUrl: './section-license.component.html',
})
export class LicenseSectionComponent extends SectionModelComponent implements OnInit {

  public formId;
  public formModel: DynamicFormControlModel[];
  public displaySubmit = false;
  public licenseText: string;

  protected operationsBuilder: JsonPatchOperationsBuilder;
  protected subs: Subscription[] = [];

  constructor(protected collectionDataService: CollectionDataService,
              protected formBuilderService: FormBuilderService,
              protected formService: FormService,
              protected operationsState: Store<CoreState>,
              protected store:Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.formId = this.sectionData.id;
    this.formModel = SECTION_LICENSE_FORM_MODEL;
    this.operationsBuilder = new JsonPatchOperationsBuilder(this.operationsState, 'sections', this.sectionData.id);

    this.subs.push(
      this.collectionDataService.findById(this.sectionData.collectionId)
        .filter((collectionData: RemoteData<Collection>) => isNotUndefined((collectionData.payload)))
        .flatMap((collectionData: RemoteData<Collection>) => collectionData.payload.license)
        .filter((licenseData: RemoteData<License>) => isNotUndefined((licenseData.payload)))
        .subscribe((licenseData: RemoteData<License>) => {
          this.licenseText = licenseData.payload.text;
        })
    );
  }

  /*ngAfterViewInit() {
    this.forms.changes.subscribe((comps: QueryList <FormComponent>) => {
      this.formRef = comps.first;
      if (hasValue(this.formRef)) {
        this.formService.isValid(this.formRef.getFormUniqueId())
          .debounceTime(1)
          .subscribe((formState) => {
            // this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId, this.sectionData.id, formState));
          });
      }
    });
  }*/

  onChange(event: DynamicFormControlEvent) {
    const path = this.formBuilderService.getFieldPathFromChangeEvent(event);
    const value = this.formBuilderService.getFieldValueFromChangeEvent(event);
    this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId, this.sectionData.id, value));
    if (value) {
      this.operationsBuilder.replace(path, dateToGMTString(new Date()), true);
    } else {
      this.operationsBuilder.remove(path);
    }
  }
}
