import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { of as observableOf, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map } from 'rxjs/operators';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SubmissionObjectEntry } from '../objects/submission-objects.reducer';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { SubmissionService } from '../submission.service';
import { AuthService } from '../../core/auth/auth.service';
import { SectionDataObject } from '../sections/models/section-data.model';
import { UploaderOptions } from '../../shared/uploader/uploader-options.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { Collection } from '../../core/shared/collection.model';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';

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

  /**
   * The list of submission's sections
   * @type {WorkspaceitemSectionsObject}
   */
  @Input() sections: WorkspaceitemSectionsObject;

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
   * Observable of the list of submission's sections
   * @type {Observable<WorkspaceitemSectionsObject>}
   */
  public submissionSections: Observable<WorkspaceitemSectionsObject>;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  public uploadFilesOptions: UploaderOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

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
   */
  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private halService: HALEndpointService,
    private submissionService: SubmissionService) {
    this.isActive = true;
  }

  /**
   * Initialize all instance variables and retrieve form configuration
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.collectionId && this.submissionId) {
      this.isActive = true;

      // retrieve submission's section list
      this.submissionSections = this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter(() => this.isActive),
        map((submission: SubmissionObjectEntry) => submission.isLoading),
        map((isLoading: boolean) => isLoading),
        distinctUntilChanged(),
        flatMap((isLoading: boolean) => {
          if (!isLoading) {
            return this.getSectionsList();
          } else {
            return observableOf([])
          }
        }));

      // check if is submission loading
      this.loading = this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter(() => this.isActive),
        map((submission: SubmissionObjectEntry) => submission.isLoading),
        map((isLoading: boolean) => isLoading),
        distinctUntilChanged());

      // init submission state
      this.subs.push(
        this.halService.getEndpoint('workspaceitems').pipe(
          filter((href: string) => isNotEmpty(href)),
          distinctUntilChanged())
          .subscribe((endpointURL) => {
            this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
            this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}`);
            this.definitionId = this.submissionDefinition.name;
            this.submissionService.dispatchInit(
              this.collectionId,
              this.submissionId,
              this.selfUrl,
              this.submissionDefinition,
              this.sections,
              null);
            this.changeDetectorRef.detectChanges();
          })
      );

      // start auto save
      this.submissionService.startAutoSave(this.submissionId);
    }
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
    this.collectionId = (submissionObject.collection as Collection).id;
    if (this.definitionId !== (submissionObject.submissionDefinition as SubmissionDefinitionsModel).name) {
      this.sections = submissionObject.sections;
      this.submissionDefinition = (submissionObject.submissionDefinition as SubmissionDefinitionsModel);
      this.definitionId = this.submissionDefinition.name;
      this.submissionService.resetSubmissionObject(
        this.collectionId,
        this.submissionId,
        submissionObject.self,
        this.submissionDefinition,
        this.sections);
    } else {
      this.changeDetectorRef.detectChanges();
    }
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
      map((sections: SectionDataObject[]) => sections));
  }
}
