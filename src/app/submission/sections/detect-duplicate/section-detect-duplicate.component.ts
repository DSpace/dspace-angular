import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
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
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-section-detect-duplicate',
  templateUrl: './section-detect-duplicate.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

@renderSectionFor(SectionsType.DetectDuplicate)
export class SubmissionSectionDetectDuplicateComponent extends SectionModelComponent {
  public AlertTypeEnum = AlertType;
  public isLoading = true;
  public sectionData$: Observable<any>;
  public matches = {};

  config: PaginationComponentOptions;
  sortConfig: SortOptions;

  isWorkFlow = false;
  disclaimer: Observable<string>;

  constructor(protected detectDuplicateService: DetectDuplicateService,
              protected translate: TranslateService,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  onSectionInit() {
    this.config = new PaginationComponentOptions();
    this.config.id = 'duplicated_items';
    this.config.pageSize = 2;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);

    this.isWorkFlow = this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkflowItem;

    this.sectionData$ = this.detectDuplicateService.getDuplicateMatchesByScope(this.submissionId, this.sectionData.id, this.isWorkFlow);

    this.disclaimer = this.isWorkFlow ?
      this.translate.get('submission.sections.detect-duplicate.disclaimer-ctrl')
      : this.translate.get('submission.sections.detect-duplicate.disclaimer');

    this.isLoading = false;
  }

  protected getSectionStatus(): Observable<boolean> {
    // a sto punto conto gli elementi se == 0 -> TRUE
    return this.sectionData$.pipe(
      map((totalMatches: number) => totalMatches === 0));
  }

  setPage(page: number) {
    this.config.currentPage = page;
  }

  onSectionDestroy(): void {
    if (hasValue(this.sectionData)) {
      this.sectionData.unsubscribe();
    }
  }

}
