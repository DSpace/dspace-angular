import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Metadata } from '../../../../core/submission/models/sherpa-policies-details.model';

/**
 * This component represents a section that contains the metadata information.
 */
@Component({
  selector: 'ds-metadata-information',
  templateUrl: './metadata-information.component.html',
  styleUrls: ['./metadata-information.component.scss'],
  imports: [
    DatePipe,
    TranslateModule,
  ],
  standalone: true,
})
export class MetadataInformationComponent {
  /**
   * Metadata to show information from
   */
  @Input() metadata: Metadata;

}
