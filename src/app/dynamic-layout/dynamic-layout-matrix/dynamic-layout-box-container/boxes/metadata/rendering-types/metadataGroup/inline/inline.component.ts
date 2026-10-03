import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { FieldRenderingType } from '../../field-rendering-type';
import { metadataBoxFieldRendering } from '../../metadata-box.decorator';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders the inline  metadata group fields
 */
@metadataBoxFieldRendering(FieldRenderingType.INLINE)
@Component({
  selector: 'ds-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss'],
  imports: [
    AsyncPipe,
    MetadataRenderComponent,
    NgClass,
  ],
})
export class InlineComponent extends MetadataGroupComponent implements OnInit {

}
