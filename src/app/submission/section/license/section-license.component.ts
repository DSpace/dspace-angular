import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SectionModelComponent } from '../section.model';
import { Store } from '@ngrx/store';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
import { License } from '../../../core/shared/license.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { DynamicFormControlEvent, DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { SECTION_LICENSE_FORM_MODEL } from './section-license.model';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { FormService } from '../../../shared/form/form.service';
import { SubmissionState } from '../../submission.reducers';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';

@Component({
  selector: 'ds-submission-section-license',
  styleUrls: ['./section-license.component.scss'],
  templateUrl: './section-license.component.html',
})
export class LicenseSectionComponent extends SectionModelComponent implements OnDestroy, OnInit {

  public formId;
  public formModel: DynamicFormControlModel[];
  public displaySubmit = false;
  public licenseText: string;

  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected subs: Subscription[] = [];

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected collectionDataService: CollectionDataService,
              protected formBuilderService: FormBuilderService,
              protected formService: FormService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected store:Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);

    this.subs.push(
      this.collectionDataService.findById(this.collectionId)
        .filter((collectionData: RemoteData<Collection>) => isNotUndefined((collectionData.payload)))
        .flatMap((collectionData: RemoteData<Collection>) => collectionData.payload.license)
        .filter((licenseData: RemoteData<License>) => isNotUndefined((licenseData.payload)))
        .take(1)
        .subscribe((licenseData: RemoteData<License>) => {
          this.licenseText = licenseData.payload.text;
          this.formId = this.formService.getUniqueId(this.sectionData.id);
          this.formModel = SECTION_LICENSE_FORM_MODEL;
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  onChange(event: DynamicFormControlEvent) {
    const path = this.formBuilderService.getFieldPathFromChangeEvent(event);
    const value = this.formBuilderService.getFieldValueFromChangeEvent(event);
    this.store.dispatch(new SectionStatusChangeAction(this.submissionId, this.sectionData.id, value));
    if (value) {
      this.operationsBuilder.add(this.pathCombiner.getPath(path), value.toString(), false, true);
    } else {
      this.operationsBuilder.remove(this.pathCombiner.getPath(path));
    }
  }
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
