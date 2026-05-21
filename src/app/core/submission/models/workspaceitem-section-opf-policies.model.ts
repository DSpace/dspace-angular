import { JiscOpfPoliciesDetailsObject } from './opf-policies-details.model';

/**
 * An interface to represent the submission's item accesses condition.
 */
export interface WorkspaceitemSectionJiscOpfPoliciesObject {

  /**
   * The access condition id
   */
  id: string;

  /**
   * The Jisc Open Policy Finder policies retrievalTime
   */
  retrievalTime: string;

  /**
   * The Jisc Open Policy Finder policies details
   */
  opfResponse: JiscOpfPoliciesDetailsObject;
}
