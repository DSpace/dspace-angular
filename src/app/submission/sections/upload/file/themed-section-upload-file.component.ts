import { Component, Input } from '@angular/core';
import { SubmissionFormsModel } from 'src/app/core/config/models/config-submission-forms.model';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';
import { SubmissionSectionUploadFileComponent } from './section-upload-file.component';

@Component({
    selector: 'ds-themed-submission-upload-section-file',
    styleUrls: [],
    templateUrl: '../../../../shared/theme-support/themed.component.html'
})
export class ThemedSubmissionSectionUploadFileComponent
    extends ThemedComponent<SubmissionSectionUploadFileComponent> {

  /**
   * The list of available access condition
   * @type {Array}
   */
  @Input() availableAccessConditionOptions: any[];

  /**
   * The submission id
   * @type {string}
   */
  @Input() collectionId: string;

  /**
   * Define if collection access conditions policy type :
   * POLICY_DEFAULT_NO_LIST : is not possible to define additional access group/s for the single file
   * POLICY_DEFAULT_WITH_LIST : is possible to define additional access group/s for the single file
   * @type {number}
   */
  @Input() collectionPolicyType: number;

  /**
   * The configuration for the bitstream's metadata form
   * @type {SubmissionFormsModel}
   */
  @Input() configMetadataForm: SubmissionFormsModel;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileId: string;

  /**
   * The bitstream array key
   * @type {string}
   */
  @Input() fileIndex: string;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileName: string;

  /**
   * The section id
   * @type {string}
   */
  @Input() sectionId: string;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  protected inAndOutputNames: (keyof SubmissionSectionUploadFileComponent & keyof this)[] = [
    'availableAccessConditionOptions',
    'collectionId',
    'collectionPolicyType',
    'configMetadataForm',
    'fileId',
    'fileIndex',
    'fileName',
    'sectionId',
    'submissionId'
    ];

  protected getComponentName(): string {
    return 'SubmissionSectionUploadFileComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/submission/sections/upload/file/section-upload-file.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./section-upload-file.component`);
  }
}
