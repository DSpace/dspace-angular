import { Component } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';

/**
 * This component renders the tag metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-tag]',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.TAG)
export class TagComponent extends RenderingTypeModelComponent {

}
