import { TestBed } from '@angular/core/testing';

import { SubmissionEditCanDeactivateService } from './submission-edit-can-deactivate.service';

describe('SubmissionEditCanDeactivateService', () => {
  let service: SubmissionEditCanDeactivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionEditCanDeactivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
