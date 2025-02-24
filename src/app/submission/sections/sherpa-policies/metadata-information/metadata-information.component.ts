import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { PolicyMetadata } from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component represents a section that contains the metadata information.
 */
@Component({
  selector: 'ds-metadata-information',
  templateUrl: './metadata-information.component.html',
  styleUrls: ['./metadata-information.component.scss'],
  imports: [
    TranslateModule,
    DatePipe,
  ],
  standalone: true,
})
export class MetadataInformationComponent {
  /**
   * PolicyMetadata to show information from
   */
  @Input() metadata: PolicyMetadata;

}
