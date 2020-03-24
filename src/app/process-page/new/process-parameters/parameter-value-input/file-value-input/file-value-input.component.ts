import { Component } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

@Component({
  selector: 'ds-file-value-input',
  templateUrl: './file-value-input.component.html',
  styleUrls: ['./file-value-input.component.scss']
})
export class FileValueInputComponent extends ValueInputComponent<File> {
  file: File;
  setFile(files) {
    this.file = files.length > 0 ? files[0] : undefined;
    console.log(this.file);
    this.updateValue.emit(this.file);
  }
}
