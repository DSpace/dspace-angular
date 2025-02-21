import { SubmissionPatchRequest } from '../../data';

export class SubmissionJsonPatchOperationsServiceStub {
  protected linkPath = 'workspaceitems';
  protected patchRequestConstructor: SubmissionPatchRequest;

  jsonPatchByResourceType = jasmine.createSpy('jsonPatchByResourceType');
  jsonPatchByResourceID = jasmine.createSpy('jsonPatchByResourceID');
  deletePendingJsonPatchOperations = jasmine.createSpy('deletePendingJsonPatchOperations');

}
