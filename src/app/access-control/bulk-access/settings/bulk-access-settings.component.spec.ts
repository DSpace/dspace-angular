import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BulkAccessSettingsComponent } from './bulk-access-settings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BulkAccessSettingsComponent', () => {
  let component: BulkAccessSettingsComponent;
  let fixture: ComponentFixture<BulkAccessSettingsComponent>;
  const mockFormState = {
    'bitstream': [],
    'item': [
      {
        'name': 'embargo',
        'startDate': {
          'year': 2026,
          'month': 5,
          'day': 31
        },
        'endDate': null
      }
    ],
    'state': {
      'item': {
        'toggleStatus': true,
        'accessMode': 'replace'
      },
      'bitstream': {
        'toggleStatus': false,
        'accessMode': '',
        'changesLimit': '',
        'selectedBitstreams': []
      }
    }
  };

  const mockControl: any = jasmine.createSpyObj('AccessControlFormContainerComponent',  {
    getFormValue: jasmine.createSpy('getFormValue'),
    reset: jasmine.createSpy('reset')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbAccordionModule, TranslateModule.forRoot()],
      declarations: [BulkAccessSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAccessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.controlForm = mockControl;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a method to get the form value', () => {
    expect(component.getValue).toBeDefined();
  });

  it('should have a method to reset the form', () => {
    expect(component.reset).toBeDefined();
  });

  it('should return the correct form value', () => {
    const expectedValue = mockFormState;
    (component.controlForm as any).getFormValue.and.returnValue(mockFormState);
    const actualValue = component.getValue();
    // @ts-ignore
    expect(actualValue).toEqual(expectedValue);
  });

  it('should call reset on the control form', () => {
    component.reset();
    expect(component.controlForm.reset).toHaveBeenCalled();
  });
});
