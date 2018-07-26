import { SectionsType } from '../sections-type';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { SectionModelComponent } from '../models/section.model';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { Store } from '@ngrx/store';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { Observable } from 'rxjs/Observable';
import { isNotEmpty } from '../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';

@Component({
  selector: 'ds-deduplication-section',
  // styleUrls: ['./section-deduplication.component.scss'],
  templateUrl: './section-deduplication.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

@renderSectionFor(SectionsType.Deduplication)
export class DeduplicationSectionComponent extends SectionModelComponent implements OnInit {
  public isLoading = true;
  public sectionDataObs: Observable<any>;
  public matches = [];

  config: PaginationComponentOptions;
  sortConfig: SortOptions;

  isWorkFlow = false;
  disclaimer: Observable<string>;

  constructor(protected store: Store<SubmissionState>,
              private translate: TranslateService,
              private submissionService: SubmissionService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    this.config = new PaginationComponentOptions();
    this.config.id = 'duplicated_items';
    this.config.pageSize = 2;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);

    this.sectionDataObs = this.store.select(submissionSectionDataFromIdSelector(this.submissionId, this.sectionData.id))
      .filter((sd) => isNotEmpty(sd))
      .startWith({matches: []})
      .distinctUntilChanged()
      .map((sd) => {
        return sd;
      });

    this.isWorkFlow = this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkflowItem;

    this.disclaimer = this.isWorkFlow ?
      this.translate.get('submission.sections.deduplication.disclaimer_ctrl')
      : this.translate.get('submission.sections.deduplication.disclaimer');

    this.isLoading = false;
  }

  setPage(page) {
    console.log('Select page #', page);
    this.config.currentPage = page;
  }

}
