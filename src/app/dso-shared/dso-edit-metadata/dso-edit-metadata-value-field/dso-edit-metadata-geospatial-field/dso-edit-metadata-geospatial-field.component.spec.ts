import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { DsoEditMetadataValue } from '../../dso-edit-metadata-form';
import { DsoEditMetadataGeospatialFieldComponent } from './dso-edit-metadata-geospatial-field.component';

describe('DsoEditMetadataGeospatialFieldComponent', () => {
  let component: DsoEditMetadataGeospatialFieldComponent;
  let fixture: ComponentFixture<DsoEditMetadataGeospatialFieldComponent>;
  let editMetadataValue: DsoEditMetadataValue;
  let modalService: NgbModal;

  beforeEach(async () => {
    const metadataValue = Object.assign(new MetadataValue(), {
      value: 'POINT(19.0455 47.5072)',
    });
    editMetadataValue = new DsoEditMetadataValue(metadataValue);

    await TestBed.configureTestingModule({
      imports: [
        DsoEditMetadataGeospatialFieldComponent,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DsoEditMetadataGeospatialFieldComponent);
    component = fixture.componentInstance;
    component.mdField = 'dcterms.spatial';
    component.mdValue = editMetadataValue;
    fixture.detectChanges();

    modalService = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the picked point and emit confirm', () => {
    spyOn(modalService, 'open').and.returnValue({
      componentInstance: {},
      result: Promise.resolve('POINT(18.6833 45.993)'),
    } as any);
    spyOn(component.confirm, 'emit');

    component.openMapPicker();

    return fixture.whenStable().then(() => {
      expect(editMetadataValue.newValue.value).toBe('POINT(18.6833 45.993)');
      expect(component.confirm.emit).toHaveBeenCalledWith(false);
    });
  });

  it('should leave the value untouched when the picker is dismissed', () => {
    spyOn(modalService, 'open').and.returnValue({
      componentInstance: {},
      result: Promise.reject(new Error('dismissed')),
    } as any);

    component.openMapPicker();

    return fixture.whenStable().then(() => {
      expect(editMetadataValue.newValue.value).toBe('POINT(19.0455 47.5072)');
    });
  });
});
