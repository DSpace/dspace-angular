import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SectionModelComponent } from '../models/section.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionsService } from '../sections.service';
import { SectionDataObject } from '../models/section-data.model';

import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';

import { getFirstCompletedRemoteData, getPaginatedListPayload, getRemoteDataPayload } from '../../../core/shared/operators';
import { LdnServicesService } from '../../../admin/admin-ldn-services/ldn-services-data/ldn-services-data.service';
import { LdnService } from '../../../admin/admin-ldn-services/ldn-services-model/ldn-services.model';
import { CoarNotifyConfigDataService } from './coar-notify-config-data.service';
import { filter, map, take, tap } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionSectionError } from '../../objects/submission-section-error.model';

/**
 * This component represents a section that contains the submission section-coar-notify form.
 */
@Component({
  selector: 'ds-submission-section-coar-notify',
  templateUrl: './section-coar-notify.component.html',
  styleUrls: ['./section-coar-notify.component.scss'],
  providers: [NgbDropdown]
})
@renderSectionFor(SectionsType.CoarNotify)
export class SubmissionSectionCoarNotifyComponent extends SectionModelComponent {

  /**
   * Contains an array of string patterns.
   */
  patterns: string[] = [];
  /**
   * An object that maps string keys to arrays of LdnService objects.
   * Used to store LdnService objects by pattern.
   */
  ldnServiceByPattern: { [key: string]: LdnService[] } = {};
  /**
   * A map representing all services for each pattern
   * {
   *  'pattern': {
   *   'index': 'service.id'
   *   }
   * }
   *
   * @type {{ [key: string]: {[key: number]: number} }}
   * @memberof SubmissionSectionCoarNotifyComponent
   */
  previousServices: { [key: string]: {[key: number]: number} } = {};

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;
  /**
   * A map representing all field on their way to be removed
   * @type {Map}
   */
  protected fieldsOnTheirWayToBeRemoved: Map<string, number[]> = new Map();
  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  constructor(protected ldnServicesService: LdnServicesService,
              // protected formOperationsService: SectionFormOperationsService,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              protected coarNotifyConfigDataService: CoarNotifyConfigDataService,
              protected chd: ChangeDetectorRef,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables
   */
  onSectionInit() {
    this.setCoarNotifyConfig();
    this.getSectionServerErrorsAndSetErrorsToDisplay();
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
  }

  /**
   * Method called when section is initialized
   * Retriev available NotifyConfigs
   */
  setCoarNotifyConfig() {
    this.subs.push(
      this.coarNotifyConfigDataService.findAll().pipe(
        getFirstCompletedRemoteData()
      ).subscribe((data) => {
        if (data.hasSucceeded) {
          this.patterns = data.payload.page[0].patterns;
          this.initSelectedServicesByPattern();
        }
      }));
  }

  /**
   * Handles the change event of a select element.
   * @param pattern - The pattern of the select element.
   * @param index - The index of the select element.
   */
  onChange(pattern: string, index: number, selectedService: LdnService | null) {
    // do nothing if the selected value is the same as the previous one
    if (this.ldnServiceByPattern[pattern][index]?.id === selectedService?.id) {
      return;
    }

    // initialize the previousServices object for the pattern if it does not exist
    if (!this.previousServices[pattern]) {
      this.previousServices[pattern] = {};
    }

    if (hasNoValue(selectedService)) {
      // on value change, remove the path when the selected value is null
      // and remove the previous value stored for the same index and pattern
      this.operationsBuilder.remove(this.pathCombiner.getPath([pattern, index.toString()]));
      this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
      this.ldnServiceByPattern[pattern][index] = null;
      this.previousServices[pattern][index] = null;
      return;
    }
    // store the previous value
    this.previousServices[pattern][index] = this.ldnServiceByPattern[pattern][index]?.id;
    // set the new value
    this.ldnServiceByPattern[pattern][index] = selectedService;

    const hasPrevValueStored = hasValue(this.previousServices[pattern][index]) && this.previousServices[pattern][index] !== selectedService.id;
    if (hasPrevValueStored) {
      // replace the path
      // when there is a previous value stored and it is different from the new one
      this.operationsBuilder.replace(this.pathCombiner.getPath([pattern, index.toString()]), selectedService.id, true);
    } else {
      // add the path when there is no previous value stored
      this.operationsBuilder.add(this.pathCombiner.getPath([pattern, '-']), [selectedService.id], false, true);
    }
    // set the previous value to the new value
    this.previousServices[pattern][index] = this.ldnServiceByPattern[pattern][index].id;
    this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
    this.chd.detectChanges();
  }

  /**
   * Initializes the selected services by pattern.
   * Loops through each pattern and filters the services based on the pattern.
   * If the section data has a value for the pattern, it adds the service to the selected services by pattern.
   * If the section data does not have a value for the pattern, it adds a null service to the selected services by pattern,
   * so that the select element is initialized with a null value and to display the default select input.
   */
  initSelectedServicesByPattern(): void {
    this.patterns.forEach((pattern) => {
      if (hasValue(this.sectionData.data[pattern])) {
        this.subs.push(
          this.filterServices(pattern)
            .subscribe((services: LdnService[]) => {
              const selectedServices = services.filter((service) => {
                const selection = (this.sectionData.data[pattern] as LdnService[]).find((s: LdnService) => s.id === service.id);
                this.addService(pattern, selection);
                return this.sectionData.data[pattern].includes(service.id);
              });
              this.ldnServiceByPattern[pattern] = selectedServices;
            })
        );
      } else {
        this.ldnServiceByPattern[pattern] = [];
        this.addService(pattern, null);
      }
    });
  }

  /**
   * Adds a new service to the selected services for the given pattern.
   * @param pattern - The pattern to add the new service to.
   * @param newService - The new service to add.
   */
  addService(pattern: string, newService: LdnService) {
    // Your logic to add a new service to the selected services for the pattern
    // Example: Push the newService to the array corresponding to the pattern
    if (!this.ldnServiceByPattern[pattern]) {
      this.ldnServiceByPattern[pattern] = [];
    }
    this.ldnServiceByPattern[pattern].push(newService);
  }

  /**
   * Removes the service at the specified index from the array corresponding to the pattern.
   * (part of next phase of implementation)
   */
  removeService(pattern: string, serviceIndex: number) {
    if (this.ldnServiceByPattern[pattern]) {
      // Remove the service at the specified index from the array
      this.ldnServiceByPattern[pattern].splice(serviceIndex, 1);
    }
  }

  /**
   * Method called when dropdowns for the section are initialized
   * Retrieve services with corresponding patterns to the dropdowns.
   */
  filterServices(pattern: string): Observable<LdnService[]> {
    return this.ldnServicesService.findByInboundPattern(pattern).pipe(
      getFirstCompletedRemoteData(),
      tap((rd) => {
        if (rd.hasFailed) {
          throw new Error(`Failed to retrieve services for pattern ${pattern}`);
        }
      }),
      filter((rd) => rd.hasSucceeded),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      map((res: LdnService[]) => res.filter((service) =>
        this.hasInboundPattern(service, pattern)))
    );
  }

  /**
   * Checks if the given service has the specified inbound pattern type.
   * @param service - The service to check.
   * @param patternType - The inbound pattern type to look for.
   * @returns True if the service has the specified inbound pattern type, false otherwise.
   */
  hasInboundPattern(service: any, patternType: string): boolean {
    return service.notifyServiceInboundPatterns.some((pattern: { pattern: string }) => {
      return pattern.pattern === patternType;
    });
  }

  /**
   * Retrieves server errors for the current section and sets them to display.
   * @returns An Observable that emits the validation errors for the current section.
   */
  private getSectionServerErrorsAndSetErrorsToDisplay() {
    this.subs.push(
      this.sectionService.getSectionServerErrors(this.submissionId, this.sectionData.id).pipe(
        take(1),
        filter((validationErrors) => isNotEmpty(validationErrors)),
      ).subscribe((validationErrors: SubmissionSectionError[]) => {
        if (isNotEmpty(validationErrors)) {
          validationErrors.forEach((error) => {
            this.sectionService.setSectionError(this.submissionId, this.sectionData.id, error);
          });
        }
      }));
  }

  /**
   * Returns an observable of the errors for the current section that match the given pattern and index.
   * @param pattern - The pattern to match against the error paths.
   * @param index - The index to match against the error paths.
   * @returns An observable of the errors for the current section that match the given pattern and index.
   */
  public getShownSectionErrors$(pattern: string, index: number): Observable<SubmissionSectionError[]> {
    return this.sectionService.getShownSectionErrors(this.submissionId, this.sectionData.id, this.sectionData.sectionType)
      .pipe(
        take(1),
        filter((validationErrors) => isNotEmpty(validationErrors)),
        map((validationErrors: SubmissionSectionError[]) => {
          return validationErrors.filter((error) => {
            const path = `${pattern}/${index}`;
            return error.path.includes(path);
          });
        })
      );
  }

  /**
   * @returns An observable that emits a boolean indicating whether the section has any server errors or not.
   */
  protected getSectionStatus(): Observable<boolean> {
    return this.sectionService.getSectionServerErrors(this.submissionId, this.sectionData.id).pipe(
      map((validationErrors) => isEmpty(validationErrors)
      ));
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
