import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and label for text
 */
@Component({
  selector: 'ds-link-label',
  templateUrl: './link-label.component.html',
  styleUrls: ['./link-label.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LINK_LABEL)
export class LinkLabelComponent extends RenderingTypeModel { }
