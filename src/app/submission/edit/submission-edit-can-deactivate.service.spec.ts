import { TestBed } from '@angular/core/testing';

import { SubmissionEditCanDeactivateService } from './submission-edit-can-deactivate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from '../submission.service';
import { of } from 'rxjs';

fdescribe('SubmissionEditCanDeactivateService', () => {
  let service: SubmissionEditCanDeactivateService;
  let submissionService: SubmissionService;

  const submissionServiceSpy = jasmine.createSpyObj('submissionService', ['hasUnsavedModification']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SubmissionService, useValue: {} },
      ]
    });
    service = TestBed.inject(SubmissionEditCanDeactivateService);
    submissionService = TestBed.inject(SubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when there are unsaved changes', () => {
    beforeEach(() => {
      submissionServiceSpy.hasUnsavedModification.and.returnValue(of(false));
    });
    it('should ...', () => {
      // TODO
      expect(false).toBeTrue();
    });
  });

});
