
import {
  Component,
  Optional,
} from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FileValueAccessorDirective } from '../../../../../shared/utils/file-value-accessor.directive';
import { FileValidator } from '../../../../../shared/utils/require-file.validator';
import { controlContainerFactory } from '../../../process-form-factory';
import { ValueInputComponent } from '../value-input.component';

/**
 * Represents the user inputted value of a file parameter
 */
@Component({
  selector: 'ds-file-value-input',
  templateUrl: './file-value-input.component.html',
  styleUrls: ['./file-value-input.component.scss'],
  viewProviders: [{ provide: ControlContainer,
    useFactory: controlContainerFactory,
    deps: [[new Optional(), NgForm]] }],
  standalone: true,
  imports: [
    FileValidator,
    FileValueAccessorDirective,
    FormsModule,
    TranslateModule,
  ],
})
export class FileValueInputComponent extends ValueInputComponent<File> {
  /**
   * The current value of the file
   */
  fileObject: File;
  setFile(files) {
    this.fileObject = files.length > 0 ? files[0] : undefined;
    this.updateValue.emit(this.fileObject);
  }
}
