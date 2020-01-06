import { InjectionToken } from '@angular/core';
import mockSubmissionResponse from './mock-submission-response.json';

export class MockResponseMap extends Map<string, any> {};

export const MOCK_RESPONSE_MAP: InjectionToken<MockResponseMap> = new InjectionToken<MockResponseMap>('mockResponseMap');

/**
 * List of endpoints with their matching mock response
 * Note that this list is only used in development mode
 * In production the actual endpoints on the REST server will be called
 */
export const mockResponseMap: MockResponseMap = new Map([
  // [ '/config/submissionforms/traditionalpageone', mockSubmissionResponse ]
]);
