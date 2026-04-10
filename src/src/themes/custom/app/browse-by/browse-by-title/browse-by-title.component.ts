import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseByTitleComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-title/browse-by-title.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';

@Component({
  selector: 'ds-browse-by-title',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: './browse-by-title.component.html',
  imports: [
    AsyncPipe,
    ThemedBrowseByComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class BrowseByTitleComponent extends BaseComponent {

  private static readonly BROWSE_LABELS: Record<string, string> = {
    author: 'Author',
    title: 'Title',
    subject: 'Subject',
    language: 'Language',
    media: 'Media',
    linguistictype: 'Linguistic Data Type',
  };

  getBrowseLabel(): string {
    return BrowseByTitleComponent.BROWSE_LABELS[this.browseId] ?? this.browseId;
  }
}
