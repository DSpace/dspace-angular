import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-text]',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
@MetadataBoxFieldRendering(FieldRendetingType.TEXT)
export class TextComponent extends RenderingTypeModel {

}
