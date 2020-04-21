import { of as observableOf } from 'rxjs';

import { DetectDuplicateService } from '../../submission/sections/detect-duplicate/detect-duplicate.service';

/**
 * Mock for [[DetectDuplicateService]]
 */
export function getMockDetectDuplicateService():
DetectDuplicateService {
  return jasmine.createSpyObj('DetectDuplicateService', {
    getDuplicateMatches: jasmine.createSpy('getDuplicateMatches'),
    getDuplicateTotalMatches: jasmine.createSpy('getDuplicateTotalMatches'),
    saveDuplicateDecision: jasmine.createSpy('saveDuplicateDecision'),
    getDuplicateMatchesByScope: jasmine.createSpy('getDuplicateMatchesByScope'),
  });
}
