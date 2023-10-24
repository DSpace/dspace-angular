import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { DynamicFormControlEvent } from '@ng-dynamic-forms/core';
import { Observable, Subscription } from 'rxjs';
import { SectionModelComponent } from '../models/section.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { FormComponent } from '../../../shared/form/form.component';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { FormService } from '../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
import { TranslateService } from '@ngx-translate/core';
import { SectionDataObject } from '../models/section-data.model';
import {
  WorkspaceitemSectionNotifyServiceRequestItemDissemination
} from '../../../core/submission/models/workspaceitem-section-form-notify-service.model';
import { hasValue } from '../../../shared/empty.util';
/**
 * This component represents a section that contains the submission ldn-service form.
 */
@Component({
  selector: 'ds-ldn-service',
  templateUrl: './ldn-service.component.html',
  styleUrls: ['./ldn-service.component.scss']
})
@renderSectionFor(SectionsType.LdnService)
export class LdnServiceComponent extends SectionModelComponent {

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = false;

  /**
   * The FormComponent reference
   */
  @ViewChild('formRef') private formRef: FormComponent;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {CollectionDataService} collectionDataService
   * @param {FormBuilderService} formBuilderService
   * @param {SectionFormOperationsService} formOperationsService
   * @param {FormService} formService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translateService
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected collectionDataService: CollectionDataService,
              protected formBuilderService: FormBuilderService,
              protected formOperationsService: SectionFormOperationsService,
              protected formService: FormService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              protected translateService: TranslateService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables
   */
  onSectionInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.subs.push(
        this.sectionService.getSectionData(this.submissionId, this.sectionData.id, this.sectionData.sectionType)
            .subscribe((ldnServicesSection: WorkspaceitemSectionNotifyServiceRequestItemDissemination) => {
              console.log(ldnServicesSection);
            })
    );
  }



  /**
   * Method called when a form dfChange event is fired.
   * Dispatch form operations based on changes.
   */
  onChange(event: DynamicFormControlEvent) {
    const path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
    const value = this.formOperationsService.getFieldValueFromChangeEvent(event);
    if (value) {
      this.operationsBuilder.add(this.pathCombiner.getPath(path), value.value.toString(), false, true);
      this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
    } else {
      this.operationsBuilder.remove(this.pathCombiner.getPath(path));
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
        .filter((subscription) => hasValue(subscription))
        .forEach((subscription) => subscription.unsubscribe());
  }

  protected getSectionStatus(): Observable<boolean> {
    return undefined;
  }

}
