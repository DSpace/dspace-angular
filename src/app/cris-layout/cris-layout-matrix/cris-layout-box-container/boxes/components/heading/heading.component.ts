import { Component } from '@angular/core';
import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';

/**
 * This component renders the heading metadata fields
 */
@Component({
  selector: 'ds-heading-row',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.HEADING)
export class HeadingComponent extends RenderingTypeModelComponent {

}
