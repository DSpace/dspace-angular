import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { AlertType } from '../../../shared/alert/aletr-type';
import { DetectDuplicateService } from './detect-duplicate.service';
import { SectionsService } from '../sections.service';
import { WorkspaceitemSectionDetectDuplicateObject } from '../../../core/submission/models/workspaceitem-section-deduplication.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { SubmissionVisibility } from '../../utils/visibility.util';

/**
 * This component represents a section that contains possible duplications.
 */
@Component({
  selector: 'ds-submission-section-detect-duplicate',
  templateUrl: './section-detect-duplicate.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

@renderSectionFor(SectionsType.DetectDuplicate)
export class SubmissionSectionDetectDuplicateComponent extends SectionModelComponent {
  /**
   * The Alert categories.
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * Variable to track if the section is loading.
   * @type {boolean}
   */
  public isLoading = true;

  /**
   * The object containing the list of the possible duplications.
   * @type {Observable}
   */
  public sectionData$: Observable<WorkspaceitemSectionDetectDuplicateObject>;

  /**
   * The list of the possible duplications.
   * @type {Object}
   */
  public matches = {};

  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  config$: Observable<PaginationComponentOptions>;

  /**
   * The duplications list sort options.
   * @type {SortOptions}
   */
  sortConfig: SortOptions = new SortOptions('dc.title', SortDirection.ASC);

  /**
   * If TRUE the submission scope is the 'workflow'; 'workspace' otherwise.
   * @type {boolean}
   */
  isWorkFlow = false;

  /**
   * The list of the possible duplications.
   * @type {PaginationComponentOptions}
   */
  disclaimer: Observable<string>;

  /**
   * Initialize instance variables.
   *
   * @param {DetectDuplicateService} detectDuplicateService
   * @param {PaginationService} paginationService
   * @param {TranslateService} translate
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected detectDuplicateService: DetectDuplicateService,
              protected paginationService: PaginationService,
              protected translate: TranslateService,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables and retrieve configuration.
   */
  onSectionInit() {
    const config = new PaginationComponentOptions();
    config.id = 'dup';
    config.pageSize = 2;
    config.pageSizeOptions = [1, 2, 5];
    this.config$ = this.paginationService.getCurrentPagination(config.id, config);

    if (this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkflowItem) {
      this.isWorkFlow = true;
      this.disclaimer = this.translate.get('submission.sections.detect-duplicate.disclaimer-ctrl');
    } else {
      this.isWorkFlow = false;
      this.disclaimer = this.translate.get('submission.sections.detect-duplicate.disclaimer');
    }

    this.sectionData$ = this.detectDuplicateService.getDuplicateMatchesByScope(this.submissionId, this.sectionData.id, this.isWorkFlow);

    this.isLoading = false;
  }

  /**
   * Get section status.
   *
   * @return Observable<boolean>
   *     the section status
   */
  public getSectionStatus(): Observable<boolean> {
    return this.sectionData$.pipe(
      map((totalMatches: any) => {
        let output = false;
        if (Object.keys(totalMatches.matches).length === 0) {
          output = true;
        }
        return output;
      })
    );
  }

  /**
   * Get the count of the possible duplications.
   *
   * @return Observable<number>
   *     the number of possible duplications
   */
  getTotalMatches(): Observable<number> {
    return this.sectionData$.pipe(
      map((totalMatches: any) => Object.keys(totalMatches.matches).length)
    );
  }

  /**
   * Check if upload section has read-only visibility
   */
  isReadOnly(): boolean {
    return SubmissionVisibility.isReadOnly(
      this.sectionData.sectionVisibility,
      this.submissionService.getSubmissionScope()
    );
  }

  /**
   * Unsubscribe from all subscriptions, if needed.
   */
  onSectionDestroy(): void {
    return;
  }

}
