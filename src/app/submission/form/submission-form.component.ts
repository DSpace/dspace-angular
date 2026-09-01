import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '@dspace/core/auth/auth.service';
import { SubmissionDefinitionsModel } from '@dspace/core/config/models/config-submission-definitions.model';
import { SubmissionSectionModel } from '@dspace/core/config/models/config-submission-section.model';
import { Collection } from '@dspace/core/shared/collection.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { MetadataSecurityConfigurationService } from '@dspace/core/submission/metadatasecurityconfig-data.service';
import { MetadataSecurityConfiguration } from '@dspace/core/submission/models/metadata-security-configuration';
import { SubmissionVisibilityType } from '@dspace/core/submission/models/section-visibility.model';
import { SubmissionError } from '@dspace/core/submission/models/submission-error.model';
import { SubmissionObject } from '@dspace/core/submission/models/submission-object.model';
import { WorkspaceitemSectionsObject } from '@dspace/core/submission/models/workspaceitem-sections.model';
import { SectionsType } from '@dspace/core/submission/sections-type';
import {
  hasValue,
  isNotEmpty,
  isNotUndefined,
} from '@dspace/shared/utils/empty.util';
import { TranslatePipe } from '@ngx-translate/core';
import isEqual from 'lodash/isEqual';
import {
  combineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { SubmissionDefinitionsConfigDataService } from '../../core/config/submission-definitions-config-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { MetadataSecurityConfigurationService } from '../../core/submission/metadatasecurityconfig-data.service';
import { MetadataSecurityConfiguration } from '../../core/submission/models/metadata-security-configuration';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import {
  hasValue,
  isNotEmpty,
  isNotUndefined,
} from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { UploaderOptions } from '../../shared/upload/uploader/uploader-options.model';
import { SubmissionObjectEntry } from '../objects/submission-objects.reducer';
import { ThemedSubmissionSectionContainerComponent } from '../sections/container/themed-section-container.component';
import { SectionDataObject } from '../sections/models/section-data.model';
import { SectionsService } from '../sections/sections.service';
import { SubmissionService } from '../submission.service';
import { SubmissionVisibility } from '../utils/visibility.util';
import { SubmissionFormCollectionComponent } from './collection/submission-form-collection.component';
import { ThemedSubmissionFormFooterComponent } from './footer/themed-submission-form-footer.component';
import { SubmissionFormSectionAddComponent } from './section-add/submission-form-section-add.component';
import { ThemedSubmissionUploadFilesComponent } from './submission-upload-files/themed-submission-upload-files.component';

/**
 * This component represents the submission form.
 */
@Component({
  selector: 'ds-base-submission-form',
  styleUrls: ['./submission-form.component.scss'],
  templateUrl: './submission-form.component.html',
  imports: [
    CommonModule,
    SubmissionFormCollectionComponent,
    SubmissionFormSectionAddComponent,
    ThemedLoadingComponent,
    ThemedSubmissionFormFooterComponent,
    ThemedSubmissionSectionContainerComponent,
    ThemedSubmissionUploadFilesComponent,
    TranslatePipe,
  ],
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
   * @type {boolean}
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
  public isLoading$: Observable<boolean> = of(true);

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
   * @param submissionDefinitionsConfigService
   */
  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private halService: HALEndpointService,
    private submissionService: SubmissionService,
    private sectionsService: SectionsService,
    private metadataSecurityConfigDataService: MetadataSecurityConfigurationService,
    private submissionDefinitionsConfigService: SubmissionDefinitionsConfigDataService) {
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
            return of([]);
          }
        }));
      const isAvailable$ = this.sectionsService.isSectionTypeAvailable(this.submissionId, SectionsType.Upload);
      const isReadOnly$ = this.sectionsService.isSectionReadOnlyByType(
        this.submissionId,
        SectionsType.Upload,
        this.submissionService.getSubmissionScope(),
      );
      this.uploadEnabled$ = combineLatest([isAvailable$, isReadOnly$]).pipe(
        map(([isAvailable, isReadOnly]: [boolean, boolean]) => isAvailable && !isReadOnly),
      );

      // check if is submission loading
      this.isLoading$ = this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter(() => this.isActive),
        map((submission: SubmissionObjectEntry) => submission.isLoading),
        map((isLoading: boolean) => isLoading),
        distinctUntilChanged());

      // init submission state
      this.subs.push(
        this.halService.getEndpoint(this.submissionService.getSubmissionObjectLinkName()).pipe(
          filter((href: string) => isNotEmpty(href)),
          distinctUntilChanged(),
          // Follow the sections HAL link on the submission definition to make sure ALL sections
          // (across every page) are loaded before initializing the form. Falls back to the
          // embedded sections when the link is unavailable or its resolution fails.
          switchMap((endpointURL: string) => this.resolveAllSections().pipe(
            take(1),
            map(() => endpointURL),
          )))
          .subscribe((endpointURL: string) => {
            this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
            this.uploadFilesOptions.impersonatingID = this.authService.getImpersonateID();
            this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
            this.definitionId = this.submissionDefinition.name;
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
          }),
      );

      // start auto save
      this.submissionService.startAutoSave(this.submissionId);
    }
  }

  /**
   *  Returns the visibility object of the collection section
   */
  private getCollectionVisibility(): SubmissionVisibilityType {
    const sections = this.submissionDefinition.sections as PaginatedList<SubmissionSectionModel>;
    const submissionSectionModel: SubmissionSectionModel =
      sections.page.find(
        (section) => isEqual(section.sectionType, SectionsType.Collection),
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
      if (this.definitionId !== (submissionObject.submissionDefinition as SubmissionDefinitionsModel).name) {
        this.sections = submissionObject.sections;
        this.submissionDefinition = (submissionObject.submissionDefinition as SubmissionDefinitionsModel);
        this.definitionId = this.submissionDefinition.name;
        this.submissionService.resetSubmissionObject(
          (submissionObject.collection as Collection).id,
          this.submissionId,
          submissionObject._links.self.href,
          this.submissionDefinition,
          this.sections,
          this.item,
          this.metadataSecurityConfiguration,
        );
      } else {
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  protected getSectionsList(): Observable<any> {
    return this.submissionService.getSubmissionSections(this.submissionId).pipe(
      filter((sections: SectionDataObject[]) => isNotEmpty(sections)),
      map((sections: SectionDataObject[]) =>
        sections.filter((section: SectionDataObject) => !isEqual(section.sectionType,SectionsType.Collection))),
    );
  }

  /**
   * Follow the `sections` HAL link on the current {@link SubmissionDefinitionsModel} and replace the
   * (possibly paginated/truncated) embedded sections with the complete list fetched across all
   * pages.
   *
   * On any failure — missing link, HTTP error, or an empty result — the embedded sections that came
   * with the submission definition are kept untouched, preserving backward compatibility with
   * backends that have not yet implemented the paginated `sections` link.
   *
   * @return An observable that always completes (emitting `void`), regardless of whether the link
   *         was followed successfully or the fallback was used.
   */
  protected resolveAllSections(): Observable<void> {
    if (!hasValue(this.submissionDefinition)) {
      return observableOf(undefined);
    }
    return this.submissionDefinitionsConfigService.findAllSections(this.submissionDefinition).pipe(
      map((rd: RemoteData<PaginatedList<SubmissionSectionModel>>) => {
        if (hasValue(rd) && rd.hasSucceeded && hasValue(rd.payload) && isNotEmpty(rd.payload.page)) {
          this.submissionDefinition = Object.assign(
            Object.create(Object.getPrototypeOf(this.submissionDefinition)),
            this.submissionDefinition,
            { sections: rd.payload },
          );
        }
        // keep the embedded sections (fallback)
        return undefined;
      }),
    );
  }

}
