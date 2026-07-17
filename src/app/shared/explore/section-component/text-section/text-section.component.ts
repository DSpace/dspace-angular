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

  @Input()
    sectionId: string;

  @Input()
    textRowSection: TextRowSection;

  @Input()
    site: Site;

  constructor(
    private locale: LocaleService,
  ) {
  }

  metadataValue(content: string): Observable<string> {
    return this.locale.getCurrentLanguageCode().pipe(
      map(language => this.site?.firstMetadataValue(content, { language }) ?? ''),
    );
  }
}
