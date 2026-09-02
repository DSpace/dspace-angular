import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { SectionDataService } from '@dspace/core/data/section-data.service';
import { SiteDataService } from '@dspace/core/data/site-data.service';
import {
  SectionComponent,
  TextRowSection,
} from '@dspace/core/layout/models/section.model';
import { LocaleService } from '@dspace/core/locale/locale.service';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { Site } from '@dspace/core/shared/site.model';
import {
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  shareReplay,
  take,
} from 'rxjs/operators';

import { SuggestionsPopupComponent } from '../notifications/suggestions/popup/suggestions-popup.component';
import { ThemedConfigurationSearchPageComponent } from '../search-page/themed-configuration-search-page.component';
import { ThemedBrowseSectionComponent } from '../shared/explore/section-component/browse-section/themed-browse-section.component';
import { ThemedCountersSectionComponent } from '../shared/explore/section-component/counters-section/themed-counters-section.component';
import { ThemedFacetSectionComponent } from '../shared/explore/section-component/facet-section/themed-facet-section.component';
import { ThemedMultiColumnTopSectionComponent } from '../shared/explore/section-component/multi-column-top-section/themed-multi-column-top-section.component';
import { ThemedSearchSectionComponent } from '../shared/explore/section-component/search-section/themed-search-section.component';
import { ThemedTextSectionComponent } from '../shared/explore/section-component/text-section/themed-text-section.component';
import { ThemedTopSectionComponent } from '../shared/explore/section-component/top-section/themed-top-section.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { HomeCoarComponent } from './home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';

/**
 * The home page component.
 *
 * Supports both a static layout and a dynamic layout driven by section configurations
 * fetched from the REST API. When dynamic layout is enabled (via `enableDynamicLayout` config),
 * it renders section components similar to the explore page (top, browse, search, facet, text-row, counters).
 * Also handles site metadata rendering.
 *
 * COAR Notify inbox link headers are handled by the {@link HomeCoarComponent} rendered in the template.
 */
@Component({
  selector: 'ds-base-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  imports: [
    AsyncPipe,
    HomeCoarComponent,
    MarkdownViewerComponent,
    NgTemplateOutlet,
    RecentItemListComponent,
    SuggestionsPopupComponent,
    ThemedBrowseSectionComponent,
    ThemedConfigurationSearchPageComponent,
    ThemedCountersSectionComponent,
    ThemedFacetSectionComponent,
    ThemedHomeNewsComponent,
    ThemedMultiColumnTopSectionComponent,
    ThemedSearchFormComponent,
    ThemedSearchSectionComponent,
    ThemedTextSectionComponent,
    ThemedTopLevelCommunityListComponent,
    ThemedTopSectionComponent,
    TranslateModule,
  ],
})
export class HomePageComponent implements OnInit {

  site$: BehaviorSubject<Site> = new BehaviorSubject<Site>(null);
  recentSubmissionspageSize: number;
  showDiscoverFilters: boolean;
  homeHeaderMetadataValue$: Observable<string>;

  /** Whether the dynamic section-based home page layout is enabled via app config. */
  isDynamicHomePageEnabled: boolean;

  /** The section identifier used when fetching the home page layout ('site'). */
  sectionId = 'site';

  /**
   * Observable emitting a 2D array (rows × columns) of section components
   * to render when dynamic home page layout is enabled.
   */
  sectionComponents: Observable<SectionComponent[][]>;

  /**
   * Emits `true` when the dynamic home page has at least one configured section
   * component to render, `false` otherwise (no sections configured, empty rows,
   * or the section configuration could not be retrieved). When `false`, the home
   * page falls back to the default (static) layout.
   */
  hasConfiguredSections$: Observable<boolean>;

  /** Whether the site has a home header metadata value in the current language. */
  hasHomeHeaderMetadata: boolean;

  /** Default text-row section configuration for the home header CMS metadata. */
  homeHeaderSection: TextRowSection = {
    content: 'dspace.cms.home-header',
    contentType: 'text-metadata',
    componentType: 'text-row',
    style: '',
  };

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private route: ActivatedRoute,
    private sectionDataService: SectionDataService,
    private siteService: SiteDataService,
    private locale: LocaleService,
  ) {
    this.recentSubmissionspageSize = this.appConfig.homePage.recentSubmissions.pageSize;
    this.showDiscoverFilters = this.appConfig.homePage.showDiscoverFilters;
    this.isDynamicHomePageEnabled = this.appConfig.homePage.enableDynamicLayout;
  }

  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data.site as Site),
      take(1),
    ).subscribe((site: Site) => {
      this.site$.next(site);
    });

    this.homeHeaderMetadataValue$ = combineLatest({
      site: this.site$,
      language: this.locale.getCurrentLanguageCode(),
    }).pipe(
      take(1),
      map(({ site, language }) => site?.firstMetadataValue('dspace.cms.home-header', { language })),
    );

    if (this.isDynamicHomePageEnabled) {
      this.sectionComponents = this.sectionDataService.findById('site').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        map((section) => section?.componentRows ?? []),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

      this.hasConfiguredSections$ = this.sectionComponents.pipe(
        map((rows: SectionComponent[][]) => isNotEmpty(rows) && rows.some((row: SectionComponent[]) => isNotEmpty(row))),
      );
    } else {
      this.sectionComponents = of([]);
      this.hasConfiguredSections$ = of(false);
    }

    combineLatest([this.siteService.find().pipe(take(1)), this.locale.getCurrentLanguageCode()]).subscribe(
      ([site, language]: [Site, string]) => {
        this.hasHomeHeaderMetadata = !isEmpty(site?.firstMetadataValue('dspace.cms.home-header',
          { language }));
      },
    );
  }

  /**
   * Returns Bootstrap column classes for a section component.
   * If the section's style already contains a 'col' class, uses it as-is;
   * otherwise defaults to 'col-12' prepended to any existing style.
   *
   * @param sectionComponent the section component to compute classes for
   */
  componentClass(sectionComponent: SectionComponent) {
    const defaultCol = 'col-12';
    return (isNotEmpty(sectionComponent.style) && sectionComponent.style.includes('col')) ?
      sectionComponent.style : `${defaultCol} ${sectionComponent.style}`;
  }
}
