import { ChangeDetectorRef, Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { JsonPatchOperationPathCombiner, } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { FormService } from '../../../shared/form/form.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionModelComponent } from '../models/section.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionsService } from '../sections.service';
import { RequestService } from '../../../core/data/request.service';
import { FindListOptions, PatchRequest } from '../../../core/data/request.models';
import { Operation } from 'fast-json-patch';
import { ClarinLicenseDataService } from '../../../core/data/clarin/clarin-license-data.service';
import { ClarinLicense } from '../../../core/shared/clarin/clarin-license.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { distinctUntilChanged, filter, find } from 'rxjs/operators';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import parseSectionErrors from '../../utils/parseSectionErrors';
import { normalizeSectionData } from '../../../core/submission/submission-response-parsing.service';
import { License4Selector } from './license-4-selector.model';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { HELP_DESK_PROPERTY } from '../../../item-page/tombstone/tombstone.component';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { hasFailed } from '../../../core/data/request.reducer';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Item } from '../../../core/shared/item.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component render resource license step in the submission workflow.
 */
@Component({
  selector: 'ds-submission-section-clarin-license',
  styleUrls: ['./section-license.component.scss'],
  templateUrl: './section-license.component.html',
})
@renderSectionFor(SectionsType.clarinLicense)
export class SubmissionSectionClarinLicenseComponent extends SectionModelComponent {

  /**
   * The license selection dropdown reference.
   */
  @ViewChild('licenseSelection') licenseSelectionRef;

  /**
   * Sometimes do not show validation errors e.g. on Init.
   */
  couldShowValidationErrors = false;

  /**
   * If the Item has license - show it in the license selection.
   */
  selectedLicenseFromOptionId;

  /**
   * The mail for the help desk is loaded from the server.
   */
  helpDesk$: Observable<RemoteData<ConfigurationProperty>>;

  /**
   * Current selected license name.
   */
  selectedLicenseName = '';

  /**
   * Actual step status.
   */
  status = false;

  /**
   * Message that selected license is not supported.
   */
  unsupportedLicenseMsgHidden = new BehaviorSubject<boolean>(true);

  /**
   * Licenses loaded from the license-definitions.json and mapped to the object list.
   */
  licenses4Selector: License4Selector[] = [];

  /**
   * Filtered licenses4Selector - after searching.
   */
  filteredLicenses4Selector: License4Selector[] = [];

  /**
   * `Select a License` placeholder for the license dropdown button.
   */
  licenseSelectorDefaultValue = '';

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * The form toggleAcceptation
   * @type {DynamicFormControlModel[]}
   */
  public formModel: DynamicFormControlModel[];

  /**
   * A boolean representing if to show form submit and cancel buttons
   * @type {boolean}
   */
  public displaySubmit = false;

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
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param clarinLicenseService
   * @param translateService
   * @param itemService
   * @param workspaceItemService
   * @param halService
   * @param rdbService
   * @param configurationDataService
   * @param requestService
   * @param {FormService} formService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SectionsService} sectionService
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected clarinLicenseService: ClarinLicenseDataService,
              protected translateService: TranslateService,
              protected itemService: ItemDataService,
              protected workspaceItemService: WorkspaceitemDataService,
              protected halService: HALEndpointService,
              protected rdbService: RemoteDataBuildService,
              private configurationDataService: ConfigurationDataService,
              protected requestService: RequestService,
              protected formService: FormService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  async ngOnInit() {
    // Set default value for the license selector.
    this.licenseSelectorDefaultValue =
      this.translateService.instant('submission.sections.clarin-license.head.license-select-default-value');
    this.selectedLicenseName = this.licenseSelectorDefaultValue;

    // initialize licenses for license selector
    // It must be before `super.ngOnInit();` because that method loads the metadata from the Item and compare
    // items license with licenses4Selector.
    await this.loadLicenses4Selector();
    super.ngOnInit();
    this.helpDesk$ = this.configurationDataService.findByPropertyName(HELP_DESK_PROPERTY);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Initialize all instance variables and retrieve submission license
   */
  onSectionInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.formId = this.formService.getUniqueId(this.sectionData.id);

    // Load the accepted license of the item
    this.getActualWorkspaceItem()
      .then((workspaceItemRD: RemoteData<WorkspaceItem>) => {
        this.itemService.findByHref(workspaceItemRD.payload._links.item.href)
          .pipe(getFirstCompletedRemoteData())
          .subscribe((itemRD: RemoteData<Item>) => {
            // Load the metadata where is store clarin license name (`dc.rights`).
            const item = itemRD.payload;
            const dcRightsMetadata = item.metadata['dc.rights'];
            if (isUndefined(dcRightsMetadata)) {
              // '0' is a magic constant for a default message `Select a license ...`
              this.selectedLicenseFromOptionId = '0';
              return;
            }
            this.initializeLicenseFromMetadata(dcRightsMetadata);
          });
      });

    // subscribe validation errors
    this.subs.push(
      this.sectionService.getSectionErrors(this.submissionId, this.sectionData.id).pipe(
        filter((errors) => isNotEmpty(errors)),
        distinctUntilChanged())
        .subscribe((errors) => {
          // parse errors
          const newErrors = errors.map((error) => {
            // When the error path is only on the section,
            // replace it with the path to the form field to display error also on the form
            if (error.path === '/sections/clarin-license') {
              // check whether license is not accepted
              // if the license def is null and the toogle acceptation is false
              return Object.assign({}, error, { path: '/sections/license/clarin-license' });
            } else {
              return error;
            }
          }).filter((error) => isNotNull(error));

          if (isNotUndefined(newErrors) && isNotEmpty(newErrors)) {
            this.sectionService.checkSectionErrors(this.submissionId, this.sectionData.id, this.formId, newErrors);
            this.sectionData.errors = errors;
          } else {
            // Remove any section's errors
            this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
          }
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  /**
   * Method called when a form dfChange event is fired.
   * Dispatch form operations based on changes.
   */
  async changeLicenseNameFromRef() {
    this.selectedLicenseName = this.getLicenseNameFromRef();
    await this.maintainLicenseSelection();
  }

  /**
   * Select license by the license Id.
   */
  async selectLicense(licenseId) {
    this.selectedLicenseFromOptionId = licenseId;
    this.selectedLicenseName = this.getLicenseNameById(this.selectedLicenseFromOptionId);
    await this.maintainLicenseSelection();
  }

  /**
   * Send Replace request to the API with the selected license name and update the section status.
   * @param licenseNameRest
   */
  async sendRequest(licenseNameRest) {
    // Do not send request in initialization because the validation errors will be seen.
    if (!this.couldShowValidationErrors) {
      return;
    }

    this.updateSectionStatus();
    await this.getActualWorkspaceItem()
      .then(workspaceItemRD => {
        const requestId = this.requestService.generateRequestId();
        const hrefObs = this.halService.getEndpoint(this.workspaceItemService.getLinkPath());

        const patchOperation2 = {
          op: 'replace', path: '/license', value: licenseNameRest
        } as Operation;

        hrefObs.pipe(
          find((href: string) => hasValue(href)),
        ).subscribe((href: string) => {
          const request = new PatchRequest(requestId, href + '/' + workspaceItemRD.payload.id, [patchOperation2]);
          this.requestService.send(request);
        });

        // process the response
        this.rdbService.buildFromRequestUUID(requestId)
          .pipe(getFirstCompletedRemoteData())
          .subscribe((response: RemoteData<WorkspaceItem>) => {

            // show validation errors in every section
            const workspaceitem = response.payload;

            const {sections} = workspaceitem;
            const {errors} = workspaceitem;

            const errorsList = parseSectionErrors(errors);

            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => {
                  const sectionData = normalizeSectionData(sections[sectionId]);
                  const sectionErrors = errorsList[sectionId];
                  // update section data to show validation errors for every section (upload, form)
                  this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData, sectionErrors, sectionErrors);
                });
            }
          });
      });
  }

  /**
   * Pop up the License Selector.
   */
  clickLicense() {
    document.getElementById('license-text').click();
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    if (isEmpty(this.selectedLicenseName)) {
      this.status = null;
    } else if (isEmpty(this.sectionData.errorsToShow)) {
      this.status = true;
    } else {
      this.status = false;
    }

    return of(this.status);
  }

  /**
   * The Item has resource license name in the metadata `dc.rights`, load this metadata value and select the license
   * with this value.
   */
  private initializeLicenseFromMetadata(dcRightsMetadata: MetadataValue[]) {
    if (isEmpty(dcRightsMetadata)) {
      return;
    }

    const dcRightsValue = dcRightsMetadata[0].value;
    this.selectLicenseOnInit(dcRightsValue)
      .then(() => this.updateSectionStatus())
      .catch(err => console.error(err));
  }

  /**
   * Select the license by `licenseName` value.
   * @param licenseName loaded from the `dc.rights` item metaddata
   */
  private async selectLicenseOnInit(licenseName) {
    if (isEmpty(licenseName)) {
      this.selectedLicenseName = this.licenseSelectorDefaultValue;
    } else {
      this.selectedLicenseName = licenseName;
    }

    this.setLicenseNameForRef(this.selectedLicenseName);
  }

  /**
   * Select the license in the license selection dropdown/
   */
  private setLicenseNameForRef(licenseName) {
    this.selectedLicenseFromOptionId = this.getLicenseIdByName(licenseName);
  }

  /**
   * Send request to the API for updating the selection or show error message that the selected license
   * is not supported.
   * @private
   */
  private async maintainLicenseSelection() {
    this.isLicenseSupported(this.selectedLicenseName)
      .then(isSupported => {
        // the user has chosen first supported license so the validation errors could be showed
        if (!this.couldShowValidationErrors) {
          this.couldShowValidationErrors = true;
        }
        this.unsupportedLicenseMsgHidden.next(isSupported);

        let selectedLicenseName = '';
        if (isSupported) {
          selectedLicenseName = this.selectedLicenseName;
        }
        this.sendRequest(selectedLicenseName);
      });
  }

  /**
   * Get the license object from the API by the license name.
   */
  private async findClarinLicenseByName(licenseName): Promise<RemoteData<PaginatedList<ClarinLicense>>> {
    const options = {
      searchParams: [
        {
          fieldName: 'name',
          fieldValue: licenseName
        }
      ]
    };
    return this.clarinLicenseService.searchBy('byName', options, false)
      .pipe(getFirstCompletedRemoteData()).toPromise();
  }

  /**
   * Check if the selected license is supported by CLARIN/DSpace, because not every license from the license
   * selector must be supported by the CLARIN/DSpace.
   * @param licenseName selected license name.
   */
  private async isLicenseSupported(licenseName) {
    let supported = true;
    await this.findClarinLicenseByName(licenseName)
      .then((response: RemoteData<PaginatedList<ClarinLicense>>) => {
        if (hasFailed(response?.state) || response?.payload?.page?.length === 0) {
          supported = false;
        } else {
          supported = true;
        }
      });
    return supported;
  }

  /**
   * From the license object list get whole object by the Id.
   */
  protected getLicenseNameById(selectionLicenseId) {
    let licenseName = this.licenseSelectorDefaultValue;
    this.licenses4Selector.forEach(license4Selector => {
      if (license4Selector.id === selectionLicenseId) {
        licenseName = license4Selector.name;
        return;
      }
    });
    return licenseName;
  }

  /**
   * From the license object list get whole object by the Id.
   */
  private getLicenseIdByName(selectionLicenseName) {
    let licenseId = -1;
    this.licenses4Selector.forEach(license4Selector => {
      if (license4Selector.name === selectionLicenseName) {
        licenseId = license4Selector.id;
        return;
      }
    });
    return licenseId;
  }

  /**
   * Get the current workspace item by the submissionId.
   */
  private async getActualWorkspaceItem(): Promise<RemoteData<WorkspaceItem>> {
    return this.workspaceItemService.findById(this.submissionId)
      .pipe(getFirstCompletedRemoteData()).toPromise();
  }

  /**
   * Load selected value from the license selection dropdown reference.
   */
  private getLicenseNameFromRef() {
    let selectedLicenseId: string;
    if (isUndefined(this.licenseSelectionRef)) {
      return '';
    }

    // Get ID of selected license from the license selector.
    selectedLicenseId = this.licenseSelectionRef.nativeElement.value;
    if (isUndefined(selectedLicenseId)) {
      return '';
    }

    let selectedLicense = false;
    selectedLicense = selectedLicenseId.trim().length !== 0;

    // is any license selected - create method
    if (selectedLicense) {
      if (isUndefined(this.licenseSelectionRef.nativeElement)) {
        return;
      }
      let licenseLabel: string;

      // Compare the ID of the selected license with loaded licenses from BE.
      this.licenses4Selector.forEach(license4Selector => {
          if (license4Selector.id !== Number(selectedLicenseId)) {
            return;
          }
          licenseLabel = license4Selector.name;
        });

      // Reset selected value from license selector. Because if the user had chosen some clarin license,
      // and then he select unsupported license the id of previous selected value is still remembered in the helper span
      // with the id `secret-selected-license-from-license-selector`.
      this.licenseSelectionRef.nativeElement.value = '';
      return licenseLabel;
    }
    return '';
  }

  /**
   * Map licenses from `license-definitions.json` to the object list.
   */
  private async loadLicenses4Selector(): Promise<any> {
    // Show PUB licenses as first.
    const pubLicense4SelectorArray = [];
    // Then show ACA and RES licenses.
    const acaResLicense4SelectorArray = [];

    await this.loadAllClarinLicenses()
      .then((clarinLicenseList: ClarinLicense[]) => {
        clarinLicenseList?.forEach(clarinLicense => {
          const license4Selector = new License4Selector();
          license4Selector.id = clarinLicense.id;
          license4Selector.name = clarinLicense.name;
          license4Selector.url = clarinLicense.definition;
          license4Selector.licenseLabel = clarinLicense?.clarinLicenseLabel?.label;
          if (license4Selector.licenseLabel === 'PUB') {
            pubLicense4SelectorArray.push(license4Selector);
          } else {
            acaResLicense4SelectorArray.push(license4Selector);
          }
        });
      });

    // Sort acaResLicense4SelectorArray by the license label (ACA, RES)
    acaResLicense4SelectorArray.sort((a, b) => a.licenseLabel.localeCompare(b.licenseLabel));

    // Concat two array into one.
    this.licenses4Selector = pubLicense4SelectorArray.concat(acaResLicense4SelectorArray);
    this.filteredLicenses4Selector = this.licenses4Selector;
  }

  private loadAllClarinLicenses(): Promise<any> {
    const options = new FindListOptions();
    options.currentPage = 0;
    // Load all licenses
    options.elementsPerPage = 1000;
    return this.clarinLicenseService.findAll(options, false)
      .pipe(getFirstSucceededRemoteListPayload())
      .toPromise();
  }

  public searchInClarinLicenses(event) {
    this.filteredLicenses4Selector = this.licenses4Selector
      .filter(license4Selector => license4Selector.name.toLowerCase().includes(event.target.value.toLowerCase()));
  }
}
