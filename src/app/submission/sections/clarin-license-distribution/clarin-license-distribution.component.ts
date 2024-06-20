import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { SubmissionSectionLicenseComponent } from '../license/section-license.component';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { FormService } from '../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
import { SectionDataObject } from '../models/section-data.model';
import { TranslateService } from '@ngx-translate/core';
import { HELP_DESK_PROPERTY } from '../../../item-page/tombstone/tombstone.component';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { DynamicCheckboxModel } from '@ng-dynamic-forms/core';
import {
  JsonPatchOperationPathCombiner,
  JsonPatchOperationPathObject
} from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SECTION_LICENSE_FORM_MODEL } from '../license/section-license.model';
import { WorkspaceitemSectionLicenseObject } from '../../../core/submission/models/workspaceitem-section-license.model';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { isNotEmpty, isNotNull, isNotUndefined, isNull } from '../../../shared/empty.util';
import { getLicenseContractPagePath } from '../../../app-routing-paths';

/**
 * This component render Distribution Step License in the submission workflow.
 */
@Component({
  selector: 'ds-clarin-license-distribution',
  templateUrl: './clarin-license-distribution.component.html',
  styleUrls: ['./clarin-license-distribution.component.scss']
})
@renderSectionFor(SectionsType.License)
export class SubmissionSectionClarinLicenseDistributionComponent extends SubmissionSectionLicenseComponent {

  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected collectionDataService: CollectionDataService,
              protected formBuilderService: FormBuilderService,
              protected formOperationsService: SectionFormOperationsService,
              protected formService: FormService,
              protected translateService: TranslateService,
              private configurationDataService: ConfigurationDataService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(changeDetectorRef,
      collectionDataService,
      formBuilderService,
      formOperationsService,
      formService,
      operationsBuilder,
      sectionService,
      submissionService,
      translateService,
      injectedCollectionId,
      injectedSectionData,
      injectedSubmissionId);
  }

  /**
   * Acceptation toggle object.
   */
  toggleAcceptation: LicenseAcceptButton;

  /**
   * The mail for the help desk is loaded from the server.
   */
  helpDesk$: Observable<RemoteData<ConfigurationProperty>>;

  /**
   * Full Distribution License content is on another page.
   */
  contractRoutingPath = '';

  /**
   * Some operations do only in init.
   */
  isInit = false;

  onSectionInit(): void {
    this.isInit = true;

    this.contractRoutingPath = getLicenseContractPagePath();

    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formId = this.formService.getUniqueId(this.sectionData.id);
    this.formModel = this.formBuilderService.fromJSON(SECTION_LICENSE_FORM_MODEL);
    const model = this.formBuilderService.findById('granted', this.formModel);

    // Retrieve license accepted status
    (model as DynamicCheckboxModel).value = (this.sectionData.data as WorkspaceitemSectionLicenseObject).granted;

    this.subs.push(
      // Disable checkbox whether it's in workflow or item scope
      this.sectionService.isSectionReadOnly(
        this.submissionId,
        this.sectionData.id,
        this.submissionService.getSubmissionScope()).pipe(
        take(1),
        filter((isReadOnly) => isReadOnly))
        .subscribe(() => {
          model.disabled = true;
        }),

      this.sectionService.getSectionErrors(this.submissionId, this.sectionData.id).pipe(
        filter((errors) => isNotEmpty(errors)),
        distinctUntilChanged())
        .subscribe((errors) => {
          // parse errors
          const newErrors = errors.map((error) => {
            // When the error path is only on the section,
            // replace it with the path to the form field to display error also on the form
            if (error.path === '/sections/license') {
              // check whether license is not accepted
              if (!(model as DynamicCheckboxModel).checked) {
                return Object.assign({}, error, {path: '/sections/license/granted'});
              } else {
                return null;
              }
            } else {
              return error;
            }
          }).filter((error) => isNotNull(error));

          if (isNotEmpty(newErrors)) {
            this.sectionService.checkSectionErrors(this.submissionId, this.sectionData.id, this.formId, newErrors);
            this.sectionData.errors = errors;
          } else {
            // Remove any section's errors
            this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
          }
          this.changeDetectorRef.detectChanges();
        })
    );

    this.toggleAcceptation = {
      handleColor: 'dark',
      handleOnColor: 'danger',
      handleOffColor: 'info',
      onColor: 'success',
      offColor: 'danger',
      onText: this.translateService.instant('submission.sections.clarin-license.toggle.on-text'),
      offText: this.translateService.instant('submission.sections.clarin-license.toggle.off-text'),
      disabled: false,
      size: 'sm',
      value: (model as DynamicCheckboxModel).value
    };

    this.helpDesk$ = this.configurationDataService.findByPropertyName(HELP_DESK_PROPERTY);
  }

  /**
   * If the user click on the toggle that means initialization has ended.
   */
  changeToNotInit() {
    if (this.isInit) {
      this.isInit = false;
    }
  }

  /**
   * Method called when a form dfChange event is fired.
   * Dispatch form operations based on changes.
   */
  onChange(event: any) {
    // Filter changing value on init
    if (isNull(event)) {
      return;
    }
    if (this.isInit === true) {
      this.isInit = false;
      return;
    }

    const path = '/sections/license/granted';
    const pathObj: JsonPatchOperationPathObject = this.pathCombiner.getPath(path);
    pathObj.path = path;

    if (isNotUndefined(this.toggleAcceptation.value)) {
      this.operationsBuilder.add(pathObj, String(this.toggleAcceptation.value), false, true);
      // Remove any section's errors
      this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
    } else {
      this.operationsBuilder.remove(pathObj);
    }
    this.updateSectionStatus();
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    if (this.toggleAcceptation.value) {
      return of(true);
    }
    return of(false);
  }
}


/**
 * Toggle button must contains certain attributes.
 */
interface LicenseAcceptButton {
  handleColor: string|null;
  handleOnColor: string|null;
  handleOffColor: string|null;
  onColor: string;
  offColor: string;
  onText: string;
  offText: string;
  disabled: boolean;
  size: 'sm' | 'lg' | '';
  value: boolean;
}
