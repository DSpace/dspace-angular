import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { GeospatialItemPageFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/geospatial/geospatial-item-page-field.component';
import { GeospatialMapComponent } from '../../../../../../../../app/shared/geospatial-map/geospatial-map.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';

@Component({
  selector: 'ds-themed-geospatial-item-page-field',
  // templateUrl: './geospatial-item-page-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/geospatial/geospatial-item-page-field.component.html',
  imports: [
    GeospatialMapComponent,
    MetadataFieldWrapperComponent,
    TranslatePipe,
  ],
  standalone: true,
})
export class GeospatialItemPageFieldComponent extends BaseComponent {
}
