import { Component } from '@angular/core';

import {
  FieldRenderingType,
  MetadataBoxFieldRendering,
} from '../../metadata-box.decorator';
import { MetadataGroupComponent } from '../metadata-group.component';
import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

/**
 * This component renders the table  metadata group fields
 */
@Component({
    selector: 'ds-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        MetadataRenderComponent,
        AsyncPipe,
    ],
})
@MetadataBoxFieldRendering(FieldRenderingType.TABLE, true)
export class TableComponent extends MetadataGroupComponent {

}
