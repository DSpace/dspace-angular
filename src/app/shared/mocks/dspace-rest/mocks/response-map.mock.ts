import { InjectionToken } from '@angular/core';
// import mockSubmissionResponse from './mock-submission-response.json';
// import mockPublicationResponse from './mock-publication-response.json';
// import mockUntypedItemResponse from './mock-untyped-item-response.json';
import mockFeatureItemCanManageBitstreamsResponse from './mock-feature-item-can-manage-bitstreams-response.json';

export class ResponseMapMock extends Map<string, any> {}

export const MOCK_RESPONSE_MAP: InjectionToken<ResponseMapMock> = new InjectionToken<ResponseMapMock>('mockResponseMap');

/**
 * List of endpoints with their matching mock response
 * Note that this list is only used in development mode
 * In production the actual endpoints on the REST server will be called
 */
export const mockResponseMap: ResponseMapMock = new Map([
  // [ '/config/submissionforms/traditionalpageone', mockSubmissionResponse ]
  // [ '/api/pid/find', mockPublicationResponse ],
  // [ '/api/pid/find', mockUntypedItemResponse ],
  [ 'https://api7.dspace.org/server/api/authz/authorizations/search/object?uri=https://api7.dspace.org/server/api/core/items/96715576-3748-4761-ad45-001646632963&feature=canManageBitstreams&embed=feature', mockFeatureItemCanManageBitstreamsResponse ],
]);
