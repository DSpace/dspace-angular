import {
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TextRowSection } from '../../../../core/layout/models/section.model';
import { LocaleService } from '../../../../core/locale/locale.service';
import { Site } from '../../../../core/shared/site.model';
import { MarkdownViewerModule } from '../../../markdown-viewer/markdown-viewer.module';

@Component({
  selector: 'ds-base-text-section',
  templateUrl: './text-section.component.html',
  styleUrls: ['./text-section.component.scss'],
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase,
    MarkdownViewerModule,
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

  metadataValue(content: string) {
    return this.site?.firstMetadataValue(content, { language: this.locale.getCurrentLanguageCode() }) ?? '';
  }
}
