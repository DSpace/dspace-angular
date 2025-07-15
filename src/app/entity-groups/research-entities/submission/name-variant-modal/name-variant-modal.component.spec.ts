import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NgbActiveModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { NameVariantModalComponent } from './name-variant-modal.component';

describe('NameVariantModalComponent', () => {
  let component: NameVariantModalComponent;
  let fixture: ComponentFixture<NameVariantModalComponent>;
  let debugElement;
  let modal;

  function init() {
    modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);
  }
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [NgbModule, TranslateModule.forRoot(), NameVariantModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: modal }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameVariantModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when close button is clicked, dismiss should be called on the modal', () => {
    debugElement.query(By.css('button.btn-close')).triggerEventHandler('click', {});
    expect(modal.dismiss).toHaveBeenCalled();
  });

  it('when confirm button is clicked, close should be called on the modal', () => {
    debugElement.query(By.css('button.confirm-button')).triggerEventHandler('click', {});
    expect(modal.close).toHaveBeenCalled();
  });

  it('when decline button is clicked, dismiss should be called on the modal', () => {
    debugElement.query(By.css('button.decline-button')).triggerEventHandler('click', {});
    expect(modal.dismiss).toHaveBeenCalled();
  });
});
