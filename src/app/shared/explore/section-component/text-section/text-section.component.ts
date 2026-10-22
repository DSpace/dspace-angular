import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TextRowSection } from '@dspace/core/layout/models/section.model';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Site } from '@dspace/core/shared/site.model';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MarkdownViewerComponent } from '../../../markdown-viewer/markdown-viewer.component';


/**
 * Component that renders a text section, supporting localized metadata content
 * from the Site object or static markdown/HTML content rendering.
 */
@Component({
  selector: 'ds-base-text-section',
  templateUrl: './text-section.component.html',
  styleUrls: ['./text-section.component.scss'],
  imports: [
    AsyncPipe,
    MarkdownViewerComponent,
    NgTemplateOutlet,
    TranslateModule,
  ],
})
export class TextSectionComponent {

  /** Unique identifier for this section instance. */
  @Input()
    sectionId: string;

  /** Configuration object defining the text content and content type. */
  @Input()
    textRowSection: TextRowSection;

  /** The site object used to resolve metadata-based content. */
  @Input()
    site: Site;

  constructor(
    private locale: LocaleService,
  ) {
  }

  /**
   * Resolves a localized metadata value from the site object based on the current language.
   *
   * @param content the metadata key to look up on the site
   * @returns observable emitting the localized metadata value, or empty string if not found
   */
  metadataValue(content: string): Observable<string> {
    return this.locale.getCurrentLanguageCode().pipe(
      map(language => this.site?.firstMetadataValue(content, { language }) ?? ''),
    );
  }
}
