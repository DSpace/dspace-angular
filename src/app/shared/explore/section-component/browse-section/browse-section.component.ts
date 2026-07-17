
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrowseSection } from '@dspace/core/layout/models/section.model';
import { TranslateModule } from '@ngx-translate/core';

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

  /** Unique identifier for this section instance. */
  @Input()
    sectionId: string;

  /** Configuration object defining the browse indices to display as links. */
  @Input()
    browseSection: BrowseSection;

}
