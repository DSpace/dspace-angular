import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { GeospatialMapPickerComponent } from '../../../../shared/geospatial-map-picker/geospatial-map-picker.component';
import { DebounceDirective } from '../../../../shared/utils/debounce.directive';
import { AbstractDsoEditMetadataValueFieldComponent } from '../abstract-dso-edit-metadata-value-field.component';

/**
 * Editor for geospatial point metadata fields (e.g. `dcterms.spatial`), configured via
 * `geospatialMapViewer.spatialMetadataFields`. The value is a WKT `POINT(longitude latitude)` string, editable
 * as text or via the map picker shared with the submission form.
 */
@Component({
  selector: 'ds-dso-edit-metadata-geospatial-field',
  templateUrl: './dso-edit-metadata-geospatial-field.component.html',
  styleUrls: ['./dso-edit-metadata-geospatial-field.component.scss'],
  imports: [
    DebounceDirective,
    FormsModule,
    TranslateModule,
  ],
})
export class DsoEditMetadataGeospatialFieldComponent extends AbstractDsoEditMetadataValueFieldComponent {

  constructor(protected modalService: NgbModal) {
    super();
  }

  /**
   * Opens the shared map picker seeded with the current value, and writes the result back.
   */
  openMapPicker(): void {
    if (!this.mdValue) {
      return;
    }
    const modalRef: NgbModalRef = this.modalService.open(GeospatialMapPickerComponent, { size: 'lg' });
    modalRef.componentInstance.value = this.mdValue.newValue.value;
    modalRef.componentInstance.label = this.mdField;
    modalRef.result.then((wkt: string | null) => {
      this.mdValue.newValue.value = wkt || '';
      this.confirm.emit(false);
    }, () => {
      // dismissed - leave the value untouched
    });
  }

}
