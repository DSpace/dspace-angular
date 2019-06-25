import { InjectionToken } from '@angular/core';
import mockSuggestResponse from './mock-suggest-response.json';

export class MockResponseMap extends Map<string, any> {};

export const MOCK_RESPONSE_MAP: InjectionToken<MockResponseMap> = new InjectionToken<MockResponseMap>('mockResponseMap');

export const mockResponseMap: MockResponseMap = new Map([
  [ '/discover/suggestions', mockSuggestResponse ]
]);
