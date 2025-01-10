import {
  AsyncPipe,
  NgForOf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Observable } from 'rxjs';

import { SearchService } from '../../../../core/shared/search/search.service';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { hasValue } from '../../../empty.util';

@Component({
  selector: 'ds-search-results-skeleton',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    AsyncPipe,
    NgForOf,
  ],
  templateUrl: './search-results-skeleton.component.html',
  styleUrl: './search-results-skeleton.component.scss',
})
export class SearchResultsSkeletonComponent implements OnInit {
  @Input()
  showThumbnails: boolean;

  @Input()
  numberOfResults = 0;

  @Input()
  textLineCount = 2;

  public viewMode$: Observable<ViewMode>;

  public loadingResults: number[];

  protected readonly ViewMode = ViewMode;

  constructor(private searchService: SearchService) {
    this.viewMode$ = searchService.getViewMode();
  }

  ngOnInit() {
    this.loadingResults = Array.from({ length: this.numberOfResults }, (_, i) => i + 1);

    if (!hasValue(this.showThumbnails)) {
      // this is needed as the default value of show thumbnails is true but set in lower levels of the DOM.
      this.showThumbnails = true;
    }
  }
}
