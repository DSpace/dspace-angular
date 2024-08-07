import {
  Component,
  Input,
} from '@angular/core';

import { TextRowSection } from '../../../../core/layout/models/section.model';
import { LocaleService } from '../../../../core/locale/locale.service';
import { Site } from '../../../../core/shared/site.model';

@Component({
  selector: 'ds-base-text-section',
  templateUrl: './text-section.component.html',
  styleUrls: ['./text-section.component.scss'],
  standalone: true,
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
