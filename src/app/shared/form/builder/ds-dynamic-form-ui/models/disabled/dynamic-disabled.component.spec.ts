import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { DsDynamicDisabledComponent } from './dynamic-disabled.component';
import { FormsModule } from '@angular/forms';
import { DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicDisabledModel } from './dynamic-disabled.model';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('DsDynamicDisabledComponent', () => {
  let comp: DsDynamicDisabledComponent;
  let fixture: ComponentFixture<DsDynamicDisabledComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let model;

  function init() {
    model = new DynamicDisabledModel({ value: 'test', repeatable: false, metadataFields: [], submissionId: '1234', id: '1', hasSelectableMetadata: false });
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [DsDynamicDisabledComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: DynamicFormLayoutService,
          useValue: {}
        },
        {
          provide: DynamicFormValidationService,
          useValue: {}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicDisabledComponent);
    comp = fixture.componentInstance; // DsDynamicDisabledComponent test instance
    de = fixture.debugElement;
    el = de.nativeElement;
    comp.model = model;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have a disabled input', () => {
    const input = de.query(By.css('input'));
    expect(input.nativeElement.getAttribute('disabled')).toEqual('');
  });
});
