
import {
  Component,
  Input,
} from '@angular/core';
import { Journal } from '@dspace/core/submission/models/sherpa-policies-details.model';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component represents a section that contains the journal publication information.
 */
@Component({
  selector: 'ds-publication-information',
  templateUrl: './publication-information.component.html',
  styleUrls: ['./publication-information.component.scss'],
  imports: [
    TranslateModule,
  ],
  standalone: true,
})
export class PublicationInformationComponent {
  /**
   * Journal to show information from
   */
  @Input() journal: Journal;

}
