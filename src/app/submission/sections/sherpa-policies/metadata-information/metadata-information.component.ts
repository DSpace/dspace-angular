import {
  Component,
  Input,
} from '@angular/core';

import { Metadata } from '../../../../core/submission/models/sherpa-policies-details.model';
import { DatePipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component represents a section that contains the matadata informations.
 */
@Component({
  selector: 'ds-metadata-information',
  templateUrl: './metadata-information.component.html',
  styleUrls: ['./metadata-information.component.scss'],
  imports: [
    NgIf,
    TranslateModule,
    DatePipe
  ],
  standalone: true
})
export class MetadataInformationComponent {
  /**
   * Metadata to show information from
   */
  @Input() metadata: Metadata;

}
