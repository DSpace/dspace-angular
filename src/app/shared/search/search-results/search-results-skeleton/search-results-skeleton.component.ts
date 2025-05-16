import {
  AsyncPipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  interval,
  Observable,
} from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { AlertComponent } from '../../../alert/alert.component';
import { AlertType } from '../../../alert/alert-type';
import { hasValue } from '../../../empty.util';
import { VarDirective } from '../../../utils/var.directive';

@Component({
  selector: 'ds-search-results-skeleton',
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    AsyncPipe,
    AlertComponent,
    VarDirective,
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

  /**
   * Timer for fallback messages visualization
   */
  delayTimer$: Observable<any>;


  protected readonly ViewMode = ViewMode;


  readonly AlertTypeEnum = AlertType;

  constructor(
    private searchService: SearchService,
    private translate: TranslateService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(PLATFORM_ID) public platformId: string,
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

    if (this.showFallbackMessages && isPlatformBrowser(this.platformId)) {
      this.setFallBackMessages();
    }
  }

  setFallBackMessages(): void {
    this.warningMessage = this.warningMessage || this.translate.instant('loading.warning');
    this.errorMessage = this.errorMessage || this.translate.instant('loading.error');

    this.delayTimer$ = interval(1);
  }
}
