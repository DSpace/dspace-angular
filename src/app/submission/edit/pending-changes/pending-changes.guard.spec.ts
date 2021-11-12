import { TestBed, waitForAsync } from '@angular/core/testing';

import { PendingChangesGuard } from './pending-changes.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { of } from 'rxjs';

describe('PendingChangesGuard', () => {

  let guard: PendingChangesGuard;
  let modalService: NgbModal;
  let canDeactivateService: SubmissionEditCanDeactivateService;

  const canDeactivateServiceSpy = jasmine.createSpyObj('canDeactivateService', ['canDeactivate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        { provide: NgbModal, useValue: {} },
        { provide: SubmissionEditCanDeactivateService, useValue: canDeactivateServiceSpy },
      ]
    });
    guard = TestBed.inject(PendingChangesGuard);
    modalService = TestBed.inject(NgbModal);
    canDeactivateService = TestBed.inject(SubmissionEditCanDeactivateService);
  }));

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when there are unsaved changes', () => {
    beforeEach(() => {
      canDeactivateServiceSpy.canDeactivate.and.returnValue(of(false));
    });
    it('should ...', () => {
      // TODO
      expect(false).toBeTrue();
      // expect(guard.canDeactivate()).toBeObservable();
    });
  });

  describe('when there are not unsaved changes', () => {
    beforeEach(() => {
      canDeactivateServiceSpy.canDeactivate.and.returnValue(of(true));
    });
    it('should ...', () => {
      // TODO
      expect(false).toBeTrue();
      // expect modal called
    });
  });
});
