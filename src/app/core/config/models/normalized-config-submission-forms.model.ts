import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedConfigObject } from './normalized-config.model';
import { FormRowModel, SubmissionFormsModel } from './config-submission-forms.model';
import { resourceType } from '../../shared/resource-type.decorator';
import { ResourceType } from '../../shared/resource-type';
import { mapsTo } from '../../cache/builders/build-decorators';

/**
 * Normalized class for the configuration describing the submission form
 */
@mapsTo(SubmissionFormsModel)
@inheritSerialization(NormalizedConfigObject)
@resourceType(ResourceType.SubmissionForm, ResourceType.SubmissionForms)
export class NormalizedSubmissionFormsModel extends NormalizedConfigObject<SubmissionFormsModel> {

  /**
   * An array of [FormRowModel] that are present in this form
   */
  @autoserialize
  rows: FormRowModel[];
}
