import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-process-detail-field',
  templateUrl: './process-detail-field.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
/**
 * A component displaying a single detail about a DSpace Process
 */
export class ProcessDetailFieldComponent {
  /**
   * I18n message for the header
   */
  @Input() title: string;
}
