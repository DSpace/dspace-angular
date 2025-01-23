import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploaderComponent } from './uploader.component';

// Import your models if needed
import { UploaderOptions } from './uploader-options.model';
import { UploaderProperties } from './uploader-properties.model';
import {ThemedComponent} from '../../theme-support/themed.component';

/**
 * Themed version of UploaderComponent
 */
@Component({
  selector: 'ds-themed-uploader',
  templateUrl: './../../../shared/theme-support/themed.component.html',

})
export class ThemedUploaderComponent extends ThemedComponent<UploaderComponent> {

  @Input() dropMsg: string;
  @Input() dropOverDocumentMsg: string;
  @Input() enableDragOverDocument: boolean;
  @Input() onBeforeUpload: () => void;
  @Input() uploadFilesOptions: UploaderOptions;
  @Input() uploadProperties: UploaderProperties;


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
    'onCompleteItem',
    'onUploadError',
    'onFileSelected'
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
    // Adjust this path to match your theme folder structure
    return import(
      `../../../../themes/${themeName}/app/.../uploader.component`
      );
  }

  /**
   * Import the default, unthemed version of the component
   */
  protected importUnthemedComponent(): Promise<any> {
    return import(`./uploader.component`);
  }
}
