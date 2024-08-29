import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { PendingChangesGuard } from './pending-changes.guard';
import SpyObj = jasmine.SpyObj;

describe('PendingChangesGuard', () => {

  let guard: PendingChangesGuard;
  let modalService: SpyObj<NgbModal>;
  let canDeactivateService: SubmissionEditCanDeactivateService;

  const modalStub: any = {
    componentInstance: {
      headerLabel: 'headerLabel',
      infoLabel: 'infoLabel',
      cancelLabel: 'cancelLabel',
      confirmLabel: 'confirmLabel',
      brandColor: 'brandColor',
      confirmIcon: 'confirmIcon',
      response: of(true),
    },
  };

  const canDeactivateServiceSpy = jasmine.createSpyObj('canDeactivateService', ['canDeactivate']);

  const modalServiceSpy = jasmine.createSpyObj('modalService', {
    open: jasmine.createSpy('open'),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: SubmissionEditCanDeactivateService, useValue: canDeactivateServiceSpy },
      ],
    });
    guard = TestBed.inject(PendingChangesGuard);
    modalService = TestBed.inject(NgbModal) as SpyObj<NgbModal>;
    canDeactivateService = TestBed.inject(SubmissionEditCanDeactivateService);
    modalService.open.and.returnValue(modalStub);
  }));

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when there are unsaved changes', () => {
    beforeEach(() => {
      canDeactivateServiceSpy.canDeactivate.and.returnValue(of(false));
    });
    it('should open confirmation modal', () => {
      guard.canDeactivate().subscribe(() => {
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
