import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { combineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

import { AuthService } from '../../core/auth/auth.service';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { Collection } from '../../core/shared/collection.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { hasValue, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { UploaderOptions } from '../../shared/upload/uploader/uploader-options.model';
import { SubmissionObjectEntry } from '../objects/submission-objects.reducer';
import { SectionDataObject } from '../sections/models/section-data.model';
import { SubmissionService } from '../submission.service';
import { Item } from '../../core/shared/item.model';
import { SectionsType } from '../sections/sections-type';
import { SectionsService } from '../sections/sections.service';
import { SubmissionError } from '../objects/submission-error.model';
import {
  SubmissionSectionModel,
  SubmissionVisibilityType
} from '../../core/config/models/config-submission-section.model';
import { SubmissionVisibility } from '../utils/visibility.util';
import { MetadataSecurityConfiguration } from '../../core/submission/models/metadata-security-configuration';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { MetadataSecurityConfigurationService } from '../../core/submission/metadatasecurityconfig-data.service';

/**
 * This component represents the submission form.
 */
@Component({
  selector: 'ds-submission-form',
  styleUrls: ['./submission-form.component.scss'],
  templateUrl: './submission-form.component.html',
})
export class SubmissionFormComponent implements OnChanges, OnDestroy {

  /**
   * The collection id this submission belonging to
   * @type {string}
   */
  @Input() collectionId: string;

  @Input() item: Item;

  /**
   * Checks if the collection can be modifiable by the user
   * @type {booelan}
   */
  @Input() collectionModifiable: boolean | null = null;

  /**
   * The list of submission's sections
   * @type {WorkspaceitemSectionsObject}
   */
  @Input() sections: WorkspaceitemSectionsObject;

  /**
   * The submission errors present in the submission object
   * @type {SubmissionError}
   */
  @Input() submissionErrors: SubmissionError;

  /**
   * The submission self url
   * @type {string}
   */
  @Input() selfUrl: string;

  /**
   * The configuration object that define this submission
   * @type {SubmissionDefinitionsModel}
   */
  @Input() submissionDefinition: SubmissionDefinitionsModel;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;
  /**
   * The metadata security config based on the entity type
   * @type {MetadataSecurityConfiguration}
   */
  @Input() metadataSecurityConfiguration: MetadataSecurityConfiguration;
  /**
   * The entity type input used to create a new submission
   * @type {string}
   */
  @Input() entityType: string;

  /**
   * The configuration id that define this submission
   * @type {string}
   */
  public definitionId: string;

  /**
   * A boolean representing if a submission form is pending
   * @type {Observable<boolean>}
   */
  public loading: Observable<boolean> = observableOf(true);

  /**
   * Emits true when the submission config has bitstream uploading enabled in submission
   */
  public uploadEnabled$: Observable<boolean>;

  /**
   * Observable of the list of submission's sections
   * @type {Observable<WorkspaceitemSectionsObject>}
   */
  public submissionSections: Observable<WorkspaceitemSectionsObject>;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  public uploadFilesOptions: UploaderOptions = new UploaderOptions();

  /**
   * A boolean representing if component is active
   * @type {boolean}
   */
  protected isActive: boolean;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authService
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {HALEndpointService} halService
   * @param {SubmissionService} submissionService
   * @param {SectionsService} sectionsService
   * @param metadataSecurityConfigDataService
   */
  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private halService: HALEndpointService,
    private submissionService: SubmissionService,
    private sectionsService: SectionsService,
    private metadataSecurityConfigDataService: MetadataSecurityConfigurationService) {
    this.isActive = true;
  }

  /**
   * Initialize all instance variables and retrieve form configuration
   */
  ngOnChanges(changes: SimpleChanges) {
    if ((changes.collectionId && this.collectionId) && (changes.submissionId && this.submissionId)) {
      this.isActive = true;

      // retrieve submission's section list
      this.submissionSections = this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter(() => this.isActive),
        map((submission: SubmissionObjectEntry) => submission.isLoading),
        map((isLoading: boolean) => isLoading),
        distinctUntilChanged(),
        switchMap((isLoading: boolean) => {
          if (!isLoading) {
            return this.getSectionsList();
          } else {
            return observableOf([]);
          }
        }));
      const isAvailable$ = this.sectionsService.isSectionTypeAvailable(this.submissionId, SectionsType.Upload);
      const isReadOnly$ = this.sectionsService.isSectionReadOnlyByType(
        this.submissionId,
        SectionsType.Upload,
        this.submissionService.getSubmissionScope()
      );
      this.uploadEnabled$ = combineLatest([isAvailable$, isReadOnly$]).pipe(
        map(([isAvailable, isReadOnly]: [boolean, boolean]) => isAvailable && !isReadOnly)
      );

      // check if is submission loading
      this.loading = this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter(() => this.isActive),
        map((submission: SubmissionObjectEntry) => submission.isLoading),
        map((isLoading: boolean) => isLoading),
        distinctUntilChanged());
      // init submission state
        this.subs.push(
          this.halService.getEndpoint(this.submissionService.getSubmissionObjectLinkName()).pipe(
            filter((href: string) => isNotEmpty(href)),
            distinctUntilChanged())
            .subscribe((endpointURL) => {
              this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
              this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
              this.definitionId = this.submissionDefinition.name;
              // const { errors } = item;
              this.submissionService.dispatchInit(
                this.collectionId,
                this.submissionId,
                this.selfUrl,
                this.submissionDefinition,
                this.sections,
                this.item,
                this.submissionErrors,
                this.metadataSecurityConfiguration);
              this.changeDetectorRef.detectChanges();
            })
        );

      // start auto save
      this.submissionService.startAutoSave(this.submissionId);
    }
  }

  /**
   *  Returns the visibility object of the collection section
   */
  private getCollectionVisibility(): SubmissionVisibilityType {
    const submissionSectionModel: SubmissionSectionModel =
      this.submissionDefinition.sections.page.find(
        (section) => isEqual(section.sectionType, SectionsType.Collection)
      );

   return (hasValue(submissionSectionModel) && isNotUndefined(submissionSectionModel.visibility)) ? submissionSectionModel.visibility : null;
  }

  /**
   * Getter to see if the collection section visibility is hidden
   */
  get isSectionHidden(): boolean {
    const visibility = this.getCollectionVisibility();
    return SubmissionVisibility.isHidden(visibility, this.submissionService.getSubmissionScope());
  }

  /**
   * Getter to see if the collection section visibility is readonly
   */
  get isSectionReadonly(): boolean {
    const visibility = this.getCollectionVisibility();
    return SubmissionVisibility.isReadOnly(visibility, this.submissionService.getSubmissionScope());
  }

  /**
   * Unsubscribe from all subscriptions, destroy instance variables
   * and reset submission state
   */
  ngOnDestroy() {
    this.isActive = false;
    this.submissionService.stopAutoSave();
    this.submissionService.resetAllSubmissionObjects();
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * On collection change reset submission state in case of it has a different
   * submission definition
   *
   * @param submissionObject
   *    new submission object
   */
  onCollectionChange(submissionObject: SubmissionObject) {
    const metadata = (submissionObject.collection as Collection).metadata ? (submissionObject.collection as Collection).metadata['dspace.entity.type'] : null;
    if (metadata && metadata[0]) {
      this.entityType = metadata[0].value;
    }
    this.metadataSecurityConfigDataService.findById(this.entityType).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(res => {
      this.metadataSecurityConfiguration   = res.payload;
      this.collectionId = (submissionObject.collection as Collection).id;
      if (this.definitionId !== (submissionObject.submissionDefinition as SubmissionDefinitionsModel).name) {
        this.sections = submissionObject.sections;
        this.submissionDefinition = (submissionObject.submissionDefinition as SubmissionDefinitionsModel);
        this.definitionId = this.submissionDefinition.name;
        this.submissionService.resetSubmissionObject(
          this.collectionId,
          this.submissionId,
          submissionObject._links.self.href,
          this.submissionDefinition,
          this.sections,
          this.item,
          this.metadataSecurityConfiguration
         );
      } else {
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  /**
   * Check if submission form is loading
   */
  isLoading(): Observable<boolean> {
    return this.loading;
  }

  /**
   * Check if submission form is loading
   */
  protected getSectionsList(): Observable<any> {
    return this.submissionService.getSubmissionSections(this.submissionId).pipe(
      filter((sections: SectionDataObject[]) => isNotEmpty(sections)),
      map((sections: SectionDataObject[]) =>
        sections.filter((section: SectionDataObject) => !isEqual(section.sectionType,SectionsType.Collection))),
    );
  }

}
