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

  protected getTotalMatches(): Observable<number> {
    return this.sectionData$.pipe(
      map((totalMatches: any) => {
        const output = Object.keys(totalMatches.matches).length;
        return output;
      })
    );
  }

  setPage(page: number) {
    this.config.currentPage = page;
  }

  onSectionDestroy(): void {
    return;
  }

}
