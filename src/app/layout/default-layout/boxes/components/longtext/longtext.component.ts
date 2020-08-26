import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * This component renders the longtext metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'div[ds-longtext].container',
  templateUrl: './longtext.component.html',
  styleUrls: ['./longtext.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LONGTEXT)
export class LongtextComponent extends RenderingTypeModel { }
