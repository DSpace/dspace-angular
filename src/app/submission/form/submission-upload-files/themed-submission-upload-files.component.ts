import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { SubmissionUploadFilesComponent } from './submission-upload-files.component';
import { UploaderOptions } from '../../../shared/upload/uploader/uploader-options.model';

/**
 * Themed wrapper for {@link SubmissionUploadFilesComponent}
 */
@Component({
  selector: 'ds-themed-submission-upload-files',
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedSubmissionUploadFilesComponent extends ThemedComponent<SubmissionUploadFilesComponent> {

  @Input() collectionId: string;

  @Input() submissionId: string;

  @Input() uploadFilesOptions: UploaderOptions;

  protected inAndOutputNames: (keyof SubmissionUploadFilesComponent & keyof this)[] = [
    'collectionId',
    'submissionId',
    'uploadFilesOptions'
  ];

  protected getComponentName(): string {
    return 'SubmissionUploadFilesComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/submission/form/submission-upload-files/submission-upload-files.component.ts`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./submission-upload-files.component');
  }
}
