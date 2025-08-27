import {
  Component,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { controlContainerFactory } from '../../../process-form-factory';
import { ValueInputComponent } from '../value-input.component';

/**
 * Represents the user-inputted value of an integer parameter
 */
@Component({
  selector: 'ds-integer-value-input',
  templateUrl: './integer-value-input.component.html',
  styleUrls: ['./integer-value-input.component.scss'],
  viewProviders: [{ provide: ControlContainer,
    useFactory: controlContainerFactory,
    deps: [[new Optional(), NgForm]] }],
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
  ],
})
export class IntegerValueInputComponent extends ValueInputComponent<number> implements OnInit {
  /**
   * The current value of the integer
   */
  value: number;

  /**
   * Initial value of the field
   */
  @Input() initialValue;

  ngOnInit(): void {
    this.value = this.initialValue;
  }

  setValue(value) {
    this.value = value;
    this.updateValue.emit(value);
  }
}
