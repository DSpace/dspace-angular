import { TestBed } from '@angular/core/testing';

import { SubmissionEditCanDeactivateService } from './submission-edit-can-deactivate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from '../submission.service';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

describe('SubmissionEditCanDeactivateService', () => {
  let service: SubmissionEditCanDeactivateService;
  let submissionService: SubmissionService;

  const submissionServiceSpy = jasmine.createSpyObj('submissionService', ['hasUnsavedModification', 'isSubmissionDiscarding']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SubmissionService, useValue: submissionServiceSpy },
      ]
    });
    service = TestBed.inject(SubmissionEditCanDeactivateService);
    submissionService = TestBed.inject(SubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when submission is discarding', () => {
    beforeEach(() => {
      submissionServiceSpy.isSubmissionDiscarding.and.returnValue(of(true));
    });

    describe('and there are unsaved changes', () => {
      beforeEach(() => {
        submissionServiceSpy.hasUnsavedModification.and.returnValue(of(true));
      });
      it('canDeactivate() should return true', () => {
        const result = service.canDeactivate('id');
        const expected = cold('(a|)', {
          a: true,
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('and there are not unsaved changes', () => {
      beforeEach(() => {
        submissionServiceSpy.hasUnsavedModification.and.returnValue(of(false));
      });
      it('canDeactivate() should return true', () => {
        const result = service.canDeactivate('id');
        const expected = cold('(a|)', {
          a: true,
        });
        expect(result).toBeObservable(expected);
      });
    });
  });

  describe('when submission is not discarding', () => {
    beforeEach(() => {
      submissionServiceSpy.isSubmissionDiscarding.and.returnValue(of(false));
    });

    describe('and there are unsaved changes', () => {
      beforeEach(() => {
        submissionServiceSpy.hasUnsavedModification.and.returnValue(of(true));
      });
      it('canDeactivate() should return false', () => {
        const result = service.canDeactivate('id');
        const expected = cold('(a|)', {
          a: false,
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('and there are not unsaved changes', () => {
      beforeEach(() => {
        submissionServiceSpy.hasUnsavedModification.and.returnValue(of(false));
      });
      it('canDeactivate() should return true', () => {
        const result = service.canDeactivate('id');
        const expected = cold('(a|)', {
          a: true,
        });
        expect(result).toBeObservable(expected);
      });
    });
  });
});
