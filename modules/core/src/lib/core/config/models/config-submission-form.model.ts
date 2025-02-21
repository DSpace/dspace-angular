import {
  autoserialize,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../cache';
import { FormFieldModel } from '../../shared';
import { ConfigObject } from './config.model';
import { SUBMISSION_FORM_TYPE } from './config-type';

/**
 * An interface that define a form row and its properties.
 */
export interface FormRowModel {
  fields: FormFieldModel[];
}

/**
 * A model class for a NormalizedObject.
 */
@typedObject
@inheritSerialization(ConfigObject)
export class SubmissionFormModel extends ConfigObject {
  static type = SUBMISSION_FORM_TYPE;

  /**
   * An array of [FormRowModel] that are present in this form
   */
  @autoserialize
  rows: FormRowModel[];
}
