import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { ComColPageNavOption, ComcolPageBrowseByComponent as BaseComponent } from '../../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component';

@Component({
  selector: 'ds-themed-comcol-page-browse-by',
  styleUrls: ['./comcol-page-browse-by.component.scss'],
  templateUrl: './comcol-page-browse-by.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class ComcolPageBrowseByComponent extends BaseComponent {

  private static readonly ALLOWED_IDS = new Set([
    'search',
    'comcols',
    'browse_author',
    'browse_title',
    'browse_subject',
    'browse_language',
    'browse_linguistictype',
  ]);

  private static readonly LABEL_OVERRIDES: Record<string, string> = {
    'browse.comcol.by.language': 'By Language',
    'browse.comcol.by.media': 'By Media',
    'browse.comcol.by.linguistictype': 'By Linguistic Type',
  };

  override ngOnInit(): void {
    super.ngOnInit();
    this.allOptions$ = this.allOptions$.pipe(
      map((options: ComColPageNavOption[]) =>
        options
          .filter(opt => ComcolPageBrowseByComponent.ALLOWED_IDS.has(opt.id))
          .map(opt => ({
            ...opt,
            label: ComcolPageBrowseByComponent.LABEL_OVERRIDES[opt.label] ?? opt.label,
          })),
      ),
    );
  }
}
