import {
  AsyncPipe,
  NgForOf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component, Inject,
  Input,
  OnInit,
} from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Observable } from 'rxjs';

import { SearchService } from '../../../../core/shared/search/search.service';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { hasValue } from '../../../empty.util';
import { AlertType } from "../../../alert/alert-type";
import { TranslateService } from "@ngx-translate/core";
import { APP_CONFIG, AppConfig } from "../../../../../config/app-config.interface";

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
/**
 * Component to show placeholders for search results while loading, to give a loading feedback to the user without layout shifting.
 */
export class SearchResultsSkeletonComponent implements OnInit {
  /**
   * Whether the search result contains thumbnail
   */
  @Input()
  showThumbnails: boolean;
  /**
   * The number of search result loaded in the current page
   */
  @Input()
  numberOfResults = 0;
  /**
   * How many placeholder are displayed for the search result text
   */
  @Input()
  textLineCount = 2;
  /**
   * Whether to show fallback messages after a certain loading time
   */
  @Input() showFallbackMessages: boolean;
  /**
   * The message text for a warning
   */
  @Input() warningMessage: string;
  /**
   * The amount of time to wait for the warning message to be visible
   */
  @Input() warningMessageDelay: number;
  /**
   * The message text for an error
   */
  @Input() errorMessage: string;
  /**
   * The amount of time to wait for the error message to be visible
   */
  @Input() errorMessageDelay: number;
  /**
   * The view mode of the search page
   */
  public viewMode$: Observable<ViewMode>;
  /**
   * Array built from numberOfResults to count and iterate based on index
   */
  public loadingResults: number[];


  protected readonly ViewMode = ViewMode;


  readonly AlertTypeEnum = AlertType;

  constructor(
    private searchService: SearchService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
  ) {
    this.viewMode$ = this.searchService.getViewMode();
    this.showFallbackMessages = this.showFallbackMessages ?? this.appConfig.loader.showFallbackMessagesByDefault;
    this.warningMessageDelay = this.warningMessageDelay ?? this.appConfig.loader.warningMessageDelay;
    this.errorMessageDelay = this.errorMessageDelay ?? this.appConfig.loader.errorMessageDelay;
  }

  ngOnInit() {
    this.loadingResults = Array.from({ length: this.numberOfResults }, (_, i) => i + 1);

    if (!hasValue(this.showThumbnails)) {
      // this is needed as the default value of show thumbnails is true but set in lower levels of the DOM.
      this.showThumbnails = true;
    }
  }
}
