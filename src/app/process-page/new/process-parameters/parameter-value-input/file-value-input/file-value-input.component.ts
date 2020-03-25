import { Component } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

/**
 * Represents the user inputted value of a file parameter
 */
@Component({
  selector: 'ds-file-value-input',
  templateUrl: './file-value-input.component.html',
  styleUrls: ['./file-value-input.component.scss']
})
export class FileValueInputComponent extends ValueInputComponent<File> {
  /**
   * The current value of the file
   */
  file: File;
  setFile(files) {
    this.file = files.length > 0 ? files[0] : undefined;
    this.updateValue.emit(this.file);
  }
}
