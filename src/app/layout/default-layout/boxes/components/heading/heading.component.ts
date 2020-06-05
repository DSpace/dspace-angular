import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

/**
 * This component renders the heading metadata fields
 */
@Component({
  selector: 'ds-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.HEADING)
export class HeadingComponent extends RenderingTypeModel {

}
