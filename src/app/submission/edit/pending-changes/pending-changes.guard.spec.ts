import { TestBed, waitForAsync } from '@angular/core/testing';

import { PendingChangesGuard } from './pending-changes.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { EMPTY, of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { take } from 'rxjs/operators';

describe('PendingChangesGuard', () => {

  let guard: PendingChangesGuard;
  let modalService: NgbModal;
  let canDeactivateService: SubmissionEditCanDeactivateService;

  const modalStub = {
    componentInstance: {
      headerLabel: 'headerLabel',
      infoLabel: 'infoLabel',
      cancelLabel: 'cancelLabel',
      confirmLabel: 'confirmLabel',
      brandColor: 'brandColor',
      confirmIcon: 'confirmIcon',
      response: EMPTY,
    }
  };

  const canDeactivateServiceSpy = jasmine.createSpyObj('canDeactivateService', ['canDeactivate']);

  const modalServiceSpy = jasmine.createSpyObj('modalService', {
    open: jasmine.createSpy('open'),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
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
    it('should open confirmation modal', () => {
      guard.canDeactivate().pipe(take(1)).subscribe(() => {
        expect(modalService.open).toHaveBeenCalled();
      });

    });
  });

  describe('when there are not unsaved changes', () => {
    beforeEach(() => {
      canDeactivateServiceSpy.canDeactivate.and.returnValue(of(true));
    });
    it('should allow navigation', () => {
      const result = guard.canDeactivate();
      const expected = cold('(a|)', {
        a: true,
      });
      expect(result).toBeObservable(expected);
    });
  });
});
