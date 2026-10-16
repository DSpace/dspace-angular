import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { FieldRenderingType } from '../../field-rendering-type';
import { MetadataBoxFieldRendering } from '../../metadata-box.decorator';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders the table  metadata group fields
 */
@MetadataBoxFieldRendering(FieldRenderingType.TABLE, true)
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
