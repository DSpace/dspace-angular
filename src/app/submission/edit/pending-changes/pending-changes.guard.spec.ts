import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cold } from 'jasmine-marbles';
import {
  Observable,
  of,
} from 'rxjs';

import { SubmissionEditCanDeactivateService } from '../submission-edit-can-deactivate.service';
import { pendingChangesGuard } from './pending-changes.guard';
import SpyObj = jasmine.SpyObj;

describe('pendingChangesGuard', () => {

  let modalService: SpyObj<NgbModal>;

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
    modalService = TestBed.inject(NgbModal) as SpyObj<NgbModal>;
    modalService.open.and.returnValue(modalStub);
  }));

  it('should be created', () => {
    expect(pendingChangesGuard).toBeTruthy();
  });

  describe('when there are unsaved changes', () => {
    beforeEach(() => {
      canDeactivateServiceSpy.canDeactivate.and.returnValue(of(false));
    });
    it('should open confirmation modal', () => {
      const result$ = TestBed.runInInjectionContext(() => {
        return pendingChangesGuard({ params: { id: 'test-id' } } as any, null, null, null);
      }) as Observable<boolean>;
      result$.subscribe(() => {
        expect(modalService.open).toHaveBeenCalled();
      });
    });
  });

  describe('when there are not unsaved changes', () => {
    beforeEach(() => {
      canDeactivateServiceSpy.canDeactivate.and.returnValue(of(true));
    });
    it('should allow navigation', () => {
      TestBed.runInInjectionContext(() => {
        const result = pendingChangesGuard({ params: { id: 'test-id' } } as any, null, null, null);
        const expected = cold('(a|)', {
          a: true,
        });
        expect(result).toBeObservable(expected);
      });
    });
  });
});
