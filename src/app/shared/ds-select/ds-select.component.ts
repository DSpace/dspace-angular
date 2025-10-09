
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../btn-disabled.directive';

/**
 * Component which represent a DSpace dropdown selector.
 */
@Component({
  selector: 'ds-select',
  templateUrl: './ds-select.component.html',
  styleUrls: ['./ds-select.component.scss'],
  standalone: true,
  imports: [
    BtnDisabledDirective,
    NgbDropdownModule,
    TranslateModule,
  ],
})
export class DsSelectComponent {

  /**
   * An optional label for the dropdown selector.
   */
  @Input()
  label: string;

  /**
   * Whether the dropdown selector is disabled.
   */
  @Input()
  disabled: boolean;

  /**
   * Emits an event when the dropdown selector is opened or closed.
   */
  @Output()
  toggled = new EventEmitter();

  /**
   * Emits an event when the dropdown selector or closed.
   */
  @Output()
  close = new EventEmitter();
}
