import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { mockSubmissionId } from '../../../shared/mocks/submission.mock';
import { SubmissionService } from '../../submission.service';
import { SubmissionRestServiceStub } from '../../../shared/testing/submission-rest-service.stub';
import { SubmissionFormFooterComponent } from './submission-form-footer.component';
import { SubmissionRestService } from '../../../core/submission/submission-rest.service';
import { createTestComponent } from '../../../shared/testing/utils.test';

describe('SubmissionFormFooterComponent Component', () => {

  let comp: SubmissionFormFooterComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormFooterComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let submissionRestServiceStub: SubmissionRestServiceStub;

  const submissionId = mockSubmissionId;

  const store: any = jasmine.createSpyObj('store', {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        SubmissionFormFooterComponent,
        TestComponent
      ],
      providers: [
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SubmissionRestService, useClass: SubmissionRestServiceStub },
        { provide: Store, useValue: store },
        ChangeDetectorRef,
        NgbModal,
        SubmissionFormFooterComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-form-footer [submissionId]="submissionId"></ds-submission-form-footer>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionFormFooterComponent', inject([SubmissionFormFooterComponent], (app: SubmissionFormFooterComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionFormFooterComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      submissionRestServiceStub = TestBed.get(SubmissionRestService);
      comp.submissionId = submissionId;

    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
      submissionServiceStub = null;
      submissionRestServiceStub = null;
    });

    describe('ngOnChanges', () => {
      beforeEach(() => {
        submissionServiceStub.getSubmissionStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true
        }));

        submissionServiceStub.getSubmissionSaveProcessingStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true
        }));

        submissionServiceStub.getSubmissionDepositProcessingStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true
        }));
      });

      it('should set submissionIsInvalid properly', () => {

        const expected = cold('-c-d', {
          c: true,
          d: false
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true)
        });

        fixture.detectChanges();

        expect(compAsAny.submissionIsInvalid).toBeObservable(expected);
      });

      it('should set processingSaveStatus properly', () => {

        const expected = cold('-c-d', {
          c: false,
          d: true
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true)
        });

        fixture.detectChanges();

        expect(comp.processingSaveStatus).toBeObservable(expected);
      });

      it('should set processingDepositStatus properly', () => {

        const expected = cold('-c-d', {
          c: false,
          d: true
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true)
        });

        fixture.detectChanges();

        expect(comp.processingDepositStatus).toBeObservable(expected);
      });
    });

    it('should call dispatchSave on save', () => {

      comp.save(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchSave).toHaveBeenCalledWith(submissionId);
    });

    it('should call dispatchSaveForLater on save for later', () => {

      comp.saveLater(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchSaveForLater).toHaveBeenCalledWith(submissionId);
    });

    it('should call dispatchDeposit on save', () => {

      comp.deposit(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchDeposit).toHaveBeenCalledWith(submissionId);
    });

    it('should call dispatchDiscard on discard confirmation', () => {
      comp.showDepositAndDiscard = observableOf(true);
      fixture.detectChanges();
      const modalBtn = fixture.debugElement.query(By.css('.btn-danger'));

      modalBtn.nativeElement.click();
      fixture.detectChanges();

      const confirmBtn: any = ((document as any).querySelector('.btn-danger:nth-child(2)'));
      confirmBtn.click();

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(submissionServiceStub.dispatchDiscard).toHaveBeenCalledWith(submissionId);
      });
    });

    it('should have deposit button disabled when submission is not valid', () => {
      comp.showDepositAndDiscard = observableOf(true);
      compAsAny.submissionIsInvalid = observableOf(true);
      fixture.detectChanges();
      const depositBtn: any = fixture.debugElement.query(By.css('.btn-primary'));

      expect(depositBtn.nativeElement.disabled).toBeTruthy();
    });

    it('should not have deposit button disabled when submission is valid', () => {
      comp.showDepositAndDiscard = observableOf(true);
      compAsAny.submissionIsInvalid = observableOf(false);
      fixture.detectChanges();
      const depositBtn: any = fixture.debugElement.query(By.css('.btn-primary'));

      expect(depositBtn.nativeElement.disabled).toBeFalsy();
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  submissionId = mockSubmissionId;

}
