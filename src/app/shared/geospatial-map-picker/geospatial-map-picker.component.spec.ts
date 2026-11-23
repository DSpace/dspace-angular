import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { GeospatialMapPickerComponent } from './geospatial-map-picker.component';

describe('GeospatialMapPickerComponent', () => {
  let component: GeospatialMapPickerComponent;
  let fixture: ComponentFixture<GeospatialMapPickerComponent>;
  let modalStub: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    modalStub = jasmine.createSpyObj('modalStub', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      imports: [
        GeospatialMapPickerComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeospatialMapPickerComponent);
    component = fixture.componentInstance;
    // Lifecycle hooks are not triggered (no fixture.detectChanges()), so the Leaflet map is never initialised
    // here; this suite only covers the component's coordinate/validation logic.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no point selected initially', () => {
    expect(component.hasPoint).toBe(false);
  });

  it('should select a point via setPoint', () => {
    component.setPoint(47.5072, 19.0455, false);

    expect(component.lat).toBe(47.5072);
    expect(component.lng).toBe(19.0455);
    expect(component.hasPoint).toBe(true);
  });

  it('should detect an out-of-range latitude', () => {
    component.setPoint(120, 19.0455, false);

    expect(component.isOutOfRange).toBe(true);
  });

  it('should detect an out-of-range longitude', () => {
    component.setPoint(47.5072, 250, false);

    expect(component.isOutOfRange).toBe(true);
  });

  it('should close the modal with a WKT point on confirm', () => {
    component.setPoint(47.5072, 19.0455, false);

    component.confirm();

    expect(modalStub.close).toHaveBeenCalledWith('POINT (19.0455 47.5072)');
  });

  it('should not confirm without a valid point', () => {
    component.confirm();

    expect(modalStub.close).not.toHaveBeenCalled();
  });

  it('should close the modal with null on confirmClear', () => {
    component.confirmClear();

    expect(modalStub.close).toHaveBeenCalledWith(null);
  });

  it('should dismiss the modal on cancel', () => {
    component.cancel();

    expect(modalStub.dismiss).toHaveBeenCalled();
  });
});
