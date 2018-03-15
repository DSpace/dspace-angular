import { SectionType } from '../section-type';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { SectionModelComponent } from '../section.model';
import { renderSectionFor } from '../section-decorator';
import { SectionDataObject } from '../section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { Store } from '@ngrx/store';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { Observable } from 'rxjs/Observable';
import { isNotEmpty } from '../../../shared/empty.util';

@Component({
  selector: 'ds-deduplication-section',
  // styleUrls: ['./section-deduplication.component.scss'],
  templateUrl: './section-deduplication.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})

@renderSectionFor(SectionType.Deduplication)
export class DeduplicationSectionComponent extends SectionModelComponent implements OnInit {
  public isLoading = true;
  public sectionDataObs: Observable<any>;
  public matches = [];

  config: PaginationComponentOptions;
  sortConfig: SortOptions;

  constructor(protected store: Store<SubmissionState>,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    this.config = new PaginationComponentOptions();
    this.config.id = 'duplicated_items';
    this.config.pageSize = 2;
    this.sortConfig = new SortOptions();

    this.sectionDataObs = this.store.select(submissionSectionDataFromIdSelector(this.submissionId, this.sectionData.id))
      .filter((sd) => isNotEmpty(sd))
      .startWith( {matches:[]})
      .distinctUntilChanged()
      .map( (sd) => {
        return sd;
      });

    this.isLoading = false;
  }

  setPage(page) {
    console.log('Select page #', page);
    this.config.currentPage = page;
  }

}
