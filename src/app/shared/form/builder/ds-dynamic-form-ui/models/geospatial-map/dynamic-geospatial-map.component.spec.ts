import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  mockDynamicFormLayoutService,
  mockDynamicFormValidationService,
} from '@dspace/core/testing/dynamic-form-mock-services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';

import { DsDynamicGeospatialMapComponent } from './dynamic-geospatial-map.component';
import { DynamicGeospatialMapModel } from './dynamic-geospatial-map.model';

describe('DsDynamicGeospatialMapComponent', () => {
  let component: DsDynamicGeospatialMapComponent;
  let fixture: ComponentFixture<DsDynamicGeospatialMapComponent>;
  let model: DynamicGeospatialMapModel;
  let modalService: NgbModal;

  beforeEach(async () => {
    model = new DynamicGeospatialMapModel({
      id: 'dcterms_spatial',
      label: 'Geospatial point',
      value: 'POINT(19.0455 47.5072)',
      repeatable: false,
      metadataFields: ['dcterms.spatial'],
      submissionId: '1234',
      hasSelectableMetadata: false,
    } as any);

    await TestBed.configureTestingModule({
      imports: [
        DsDynamicGeospatialMapComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: DynamicFormLayoutService, useValue: mockDynamicFormLayoutService },
        { provide: DynamicFormValidationService, useValue: mockDynamicFormValidationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DsDynamicGeospatialMapComponent);
    component = fixture.componentInstance;
    component.model = model;
    fixture.detectChanges();

    modalService = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise currentValue from the model value', () => {
    expect(component.currentValue).toBe('POINT(19.0455 47.5072)');
  });

  it('should update the model value and emit a change when the input changes', () => {
    spyOn(component.change, 'emit');

    component.currentValue = 'POINT(18.6833 45.993)';
    component.onInputChange();

    expect(model.value).toBe('POINT(18.6833 45.993)');
    expect(component.change.emit).toHaveBeenCalledWith('POINT(18.6833 45.993)');
  });

  it('should apply the picked point from the map picker', () => {
    spyOn(modalService, 'open').and.returnValue({
      componentInstance: {},
      result: Promise.resolve('POINT(18.6833 45.993)'),
    } as any);
    spyOn(component.change, 'emit');

    component.openMapPicker();

    return fixture.whenStable().then(() => {
      expect(component.currentValue).toBe('POINT(18.6833 45.993)');
      expect(model.value).toBe('POINT(18.6833 45.993)');
      expect(component.change.emit).toHaveBeenCalledWith('POINT(18.6833 45.993)');
    });
  });
});
