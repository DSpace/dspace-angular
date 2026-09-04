import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { FieldRenderingType } from '../../field-rendering-type';
import { metadataBoxFieldRendering } from '../../metadata-box.decorator';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders the table  metadata group fields
 */
@metadataBoxFieldRendering(FieldRenderingType.TABLE)
@Component({
  selector: 'ds-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    AsyncPipe,
    MetadataRenderComponent,
  ],
})
export class TableComponent extends MetadataGroupComponent {

}
