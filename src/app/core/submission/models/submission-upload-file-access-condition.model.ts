/**
 * An interface to represent bitstream's access condition.
 */
export class SubmissionUploadFileAccessConditionObject {

  /**
   * The access condition id
   */
  id: string;

  /**
   * The access condition name
   */
  name: string;

  /**
   * Possible start date of the access condition
   */
  startDate: string;

  /**
   * Possible end date of the access condition
   */
  endDate: string;
}
