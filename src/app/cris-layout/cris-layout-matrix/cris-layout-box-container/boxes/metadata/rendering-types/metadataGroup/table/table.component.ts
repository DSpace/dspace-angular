import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';

import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { MetadataGroupComponent } from '../metadata-group.component';

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
export class TableComponent extends MetadataGroupComponent {

}
