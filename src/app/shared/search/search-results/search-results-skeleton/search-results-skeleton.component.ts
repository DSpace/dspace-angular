import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { hasValue } from '../../../empty.util';

@Component({
  selector: 'ds-search-results-skeleton',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
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

  public loadingResults: number[];

  ngOnInit() {
    this.loadingResults = Array.from({ length: this.numberOfResults }, (_, i) => i + 1);

    if (!hasValue(this.showThumbnails)) {
      // this is needed as the default value of show thumbnails is true but set in lower levels of the DOM.
      this.showThumbnails = true;
    }
  }
}
