import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseEntrySearchOptions } from '../../../../../app/core/browse/browse-entry-search-options.model';

import { BrowseByDateComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-date/browse-by-date.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { MediaCategory, BrowseEntryItem } from '../browse-by-metadata/browse-by-metadata.component';

@Component({
  selector: 'ds-browse-by-date',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: '../browse-by-metadata/browse-by-metadata.component.html',
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    ThemedBrowseByComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class BrowseByDateComponent extends BaseComponent {

  private static readonly BROWSE_LABELS: Record<string, string> = {
    author: 'Author',
    title: 'Title',
    subject: 'Subject',
    language: 'Language',
    media: 'Media',
    linguistictype: 'Linguistic Data Type',
    dateissued: 'Date Issued',
    issued: 'Date Issued',
  };

  private static readonly BROWSE_ID_REMAP: Record<string, string> = {
    media: 'linguistictype',
    linguistictype: 'subject',
  };

  // Required by shared template
  readonly mediaCategories: MediaCategory[] = [];
  readonly mediaCounts: Record<string, number> = {};
  readonly browseEntries: BrowseEntryItem[] = [];
  readonly selectedCategory: string | null = null;
  readonly categoryEntries: BrowseEntryItem[] = [];

  getBrowseLabel(): string {
    return BrowseByDateComponent.BROWSE_LABELS[this.browseId] ?? this.browseId;
  }

  private remapOptions(options: BrowseEntrySearchOptions): BrowseEntrySearchOptions {
    const remapped = BrowseByDateComponent.BROWSE_ID_REMAP[this.browseId];
    if (remapped) {
      return new BrowseEntrySearchOptions(remapped, options.pagination, options.sort, options.startsWith, options.scope, options.fetchThumbnail);
    }
    return options;
  }

  override updatePage(searchOptions: BrowseEntrySearchOptions): void {
    super.updatePage(this.remapOptions(searchOptions));
  }

  override updatePageWithItems(searchOptions: BrowseEntrySearchOptions, value: string, authority: string): void {
    super.updatePageWithItems(this.remapOptions(searchOptions), value, authority);
  }
}
