import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ClaimedTaskActionsRejectComponent } from './claimed-task-actions-reject.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';

let component: ClaimedTaskActionsRejectComponent;
let fixture: ComponentFixture<ClaimedTaskActionsRejectComponent>;
let formBuilder: FormBuilder;
let modalService: NgbModal;

describe('ClaimedTaskActionsRejectComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [ClaimedTaskActionsRejectComponent],
      providers: [
        FormBuilder,
        NgbModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsRejectComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsRejectComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.get(FormBuilder);
    modalService = TestBed.get(NgbModal);
    component.modalRef = modalService.open('ok');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    modalService = null;
    formBuilder = null;
  });

  it('should init reject form properly', () => {
    expect(component.rejectForm).toBeDefined();
    expect(component.rejectForm instanceof FormGroup).toBeTruthy();
    expect(component.rejectForm.controls.reason).toBeDefined();
  });

  it('should display reject button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-danger'));

    expect(btn).toBeDefined();
  });

  it('should display spin icon when reject is pending', () => {
    component.processingReject = true;
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-danger .fa-spin'));

    expect(span).toBeDefined();
  });

  it('should call openRejectModal on reject button click', () => {
    spyOn(component.rejectForm, 'reset');
    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    btn.nativeElement.click();
    fixture.detectChanges();

    expect(component.rejectForm.reset).toHaveBeenCalled();
    expect(component.modalRef).toBeDefined();

    component.modalRef.close()
  });

  it('should call confirmReject on form submit', () => {
    spyOn(component.reject, 'emit');

    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    btn.nativeElement.click();
    fixture.detectChanges();

    expect(component.modalRef).toBeDefined();

    const form = ((document as any).querySelector('form'));
    form.dispatchEvent(new Event('ngSubmit'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.reject.emit).toHaveBeenCalled();
    });

  });
});
