import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { BrowseByMetadataComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';

export interface MediaCategory {
  label: string;
  icon: string;
}

export interface BrowseEntryItem {
  value: string;
  count: number;
}

const CATEGORY_PATTERNS: Record<string, RegExp> = {
  'Image':    /\.(jpg|jpeg|png|gif|bmp|tif|tiff|webp|svg|ico)$/i,
  'Document': /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf|odt|ods|odp|csv)$/i,
  'Audio':    /\.(mp3|wav|ogg|flac|aac|m4a|wma|opus)$/i,
  'Video':    /\.(mp4|avi|mkv|mov|wmv|flv|webm|m4v)$/i,
  'Zip':      /\.(zip|tar|gz|rar|7z|bz2)$/i,
};

@Component({
  selector: 'ds-browse-by-metadata',
  styleUrls: ['./browse-by-metadata.component.scss'],
  templateUrl: './browse-by-metadata.component.html',
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    ThemedBrowseByComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class BrowseByMetadataComponent extends BaseComponent {

  private readonly http = inject(HttpClient);
  private readonly restConfig = inject<AppConfig>(APP_CONFIG);
  private readonly activatedRoute = inject(ActivatedRoute);

  private static readonly BROWSE_LABELS: Record<string, string> = {
    author: 'Author',
    title: 'Title',
    subject: 'Subject',
    language: 'Language',
    media: 'Media',
    linguistictype: 'Linguistic Data Type',
  };

  readonly mediaCategories: MediaCategory[] = [
    { label: 'Image',    icon: 'fas fa-image' },
    { label: 'Document', icon: 'fas fa-file-alt' },
    { label: 'Audio',    icon: 'fas fa-music' },
    { label: 'Video',    icon: 'fas fa-video' },
    { label: 'Zip',      icon: 'fas fa-file-archive' },
  ];

  mediaCounts: Record<string, number> = {};
  browseEntries: BrowseEntryItem[] = [];
  selectedCategory: string | null = null;

  // Static cache: persists for the lifetime of the app session
  private static cachedCounts: Record<string, number> | null = null;
  private static cachedEntries: BrowseEntryItem[] | null = null;

  get categoryEntries(): BrowseEntryItem[] {
    if (!this.selectedCategory) { return []; }
    const pattern = CATEGORY_PATTERNS[this.selectedCategory];
    return this.browseEntries.filter(e => pattern?.test(e.value));
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Track selected category from query params
    this.activatedRoute.queryParams.subscribe(qp => {
      this.selectedCategory = qp['cat'] ?? null;
    });

    // Fetch browse entries when on the media browse page
    this.activatedRoute.params.pipe(
      filter(p => p['id'] === 'media'),
    ).subscribe(() => {
      if (BrowseByMetadataComponent.cachedCounts) {
        this.mediaCounts = BrowseByMetadataComponent.cachedCounts;
        this.browseEntries = BrowseByMetadataComponent.cachedEntries ?? [];
      } else {
        this.fetchBrowseEntries();
      }
    });
  }

  private fetchBrowseEntries(): void {
    const url = `${this.restConfig.rest.baseUrl}/api/discover/browses/media/entries?size=500`;
    this.http.get<any>(url).pipe(
      map((r: any) => r?._embedded?.entries ?? r?._embedded?.browseEntries ?? []),
      catchError(() => of([])),
    ).subscribe((entries: any[]) => {
      this.browseEntries = entries.map((e: any) => ({
        value: e.value as string,
        count: (e.count ?? 0) as number,
      }));
      Object.keys(CATEGORY_PATTERNS).forEach(label => {
        const pattern = CATEGORY_PATTERNS[label];
        this.mediaCounts[label] = this.browseEntries
          .filter(e => pattern.test(e.value))
          .reduce((sum, e) => sum + e.count, 0);
      });
      BrowseByMetadataComponent.cachedCounts = { ...this.mediaCounts };
      BrowseByMetadataComponent.cachedEntries = [...this.browseEntries];
    });
  }

  getBrowseLabel(): string {
    return BrowseByMetadataComponent.BROWSE_LABELS[this.browseId] ?? this.browseId;
  }
}
