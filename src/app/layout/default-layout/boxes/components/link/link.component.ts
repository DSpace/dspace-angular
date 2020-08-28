import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';
import { TranslateService } from '@ngx-translate/core';
import { hasValue } from 'src/app/shared/empty.util';
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * Defines the list of subtypes for this rendering
 */
enum TYPES {
  LABEL = 'LABEL'
}

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-link]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LINK)
export class LinkComponent extends RenderingTypeModel implements OnInit {

  /**
   * text to show in the anchor
   */
  text: Observable<string>;

  constructor(private translateService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.text = new BehaviorSubject<string>(this.metadataValue)
    // If the component has label subtype get the text from translate service
    if (hasValue(this.subtype) &&
      this.subtype.toUpperCase() === TYPES.LABEL) {
        this.text = this.translateService.get( this.label );
    }
  }

}
