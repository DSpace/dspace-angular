import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ThemedComponent } from '../../theme-support/themed.component';
import { UploaderComponent } from './uploader.component';
import { UploaderOptions } from './uploader-options.model';
import { UploaderProperties } from './uploader-properties.model';

/**
 * Themed wrapper for {@link UploaderComponent}
 */
@Component({
  selector: 'ds-uploader',
  templateUrl: './../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [UploaderComponent],
})
export class ThemedUploaderComponent extends ThemedComponent<UploaderComponent> {

  @Input() dropMsg: string;
  @Input() dropOverDocumentMsg: string;
  @Input() enableDragOverDocument: boolean;
  @Input() onBeforeUpload: () => void;
  @Input() uploadFilesOptions: UploaderOptions;
  @Input() uploadProperties: UploaderProperties;
  @Input() ariaLabel: string;
  @Output() onCompleteItem = new EventEmitter<any>();
  @Output() onUploadError = new EventEmitter<any>();
  @Output() onFileSelected = new EventEmitter<any>();

  protected inAndOutputNames: (keyof UploaderComponent & keyof this)[] = [
    'dropMsg',
    'dropOverDocumentMsg',
    'enableDragOverDocument',
    'onBeforeUpload',
    'uploadFilesOptions',
    'uploadProperties',
    'ariaLabel',
    'onCompleteItem',
    'onUploadError',
    'onFileSelected',
  ];

  /**
   * Return the class name of the underlying (un-themed) component
   */
  protected getComponentName(): string {
    return 'UploaderComponent';
  }


  /**
   * Import a theme-specific version of this component (if it exists)
   */
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../../../themes/${themeName}/app/shared/upload/uploader/uploader.component`
    );
  }

  /**
   * Import the default, unthemed version of the component
   */
  protected importUnthemedComponent(): Promise<any> {
    return import(`./uploader.component`);
  }
}
