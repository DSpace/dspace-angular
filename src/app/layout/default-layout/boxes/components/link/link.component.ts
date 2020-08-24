import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
 */
@Component({
  selector: 'ds-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LINK)
export class LinkComponent extends RenderingTypeModel {

}
