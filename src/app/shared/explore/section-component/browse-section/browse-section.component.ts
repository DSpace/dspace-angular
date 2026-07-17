
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseSection } from '../../../../core/layout/models/section.model';

/**
 * Component representing the Browse component section.
 */
@Component({
  selector: 'ds-base-browse-section',
  templateUrl: './browse-section.component.html',
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class BrowseSectionComponent {

  @Input()
    sectionId: string;

  @Input()
    browseSection: BrowseSection;

}
