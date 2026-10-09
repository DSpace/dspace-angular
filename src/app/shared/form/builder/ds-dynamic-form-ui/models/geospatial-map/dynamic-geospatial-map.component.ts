import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../../../btn-disabled.directive';
import { GeospatialMapPickerComponent } from '../../../../../geospatial-map-picker/geospatial-map-picker.component';
import { DynamicGeospatialMapModel } from './dynamic-geospatial-map.model';

/**
 * Submission form field for a single geospatial point: a WKT `POINT(longitude latitude)` string. Can be typed
 * directly, or picked/verified on a map via {@link GeospatialMapPickerComponent}.
 */
@Component({
  selector: 'ds-dynamic-geospatial-map',
  styleUrls: ['./dynamic-geospatial-map.component.scss'],
  templateUrl: './dynamic-geospatial-map.component.html',
  imports: [
    BtnDisabledDirective,
    FormsModule,
    TranslateModule,
  ],
})
export class DsDynamicGeospatialMapComponent extends DynamicFormControlComponent implements OnInit {

  @Input() bindId = true;
  @Input() group: UntypedFormGroup;
  @Input() model: DynamicGeospatialMapModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  currentValue: string;

  constructor(
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService,
    protected modalService: NgbModal,
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
    this.currentValue = hasValue(this.model.value) ? this.model.value as unknown as string : '';
  }

  onInputChange(): void {
    this.dispatchUpdate(this.currentValue);
  }

  onBlur(event: Event): void {
    this.blur.emit(event);
  }

  onFocus(event: Event): void {
    this.focus.emit(event);
  }

  /**
   * Opens the shared map picker seeded with the current value, and applies the result.
   */
  openMapPicker(): void {
    if (this.model.disabled) {
      return;
    }
    const modalRef: NgbModalRef = this.modalService.open(GeospatialMapPickerComponent, { size: 'lg' });
    modalRef.componentInstance.value = this.currentValue;
    modalRef.componentInstance.label = this.model.label;
    modalRef.result.then((wkt: string | null) => {
      this.currentValue = wkt || '';
      this.dispatchUpdate(this.currentValue);
    }, () => {
      // dismissed - leave the value untouched
    });
  }

  private dispatchUpdate(value: string): void {
    this.model.value = value;
    this.change.emit(value);
  }

}
