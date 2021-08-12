import { Component, OnInit } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';

import { Chips } from '../../../../../shared/chips/models/chips.model';
import { combineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
export class TagComponent extends RenderingTypeModelComponent implements OnInit {

 /**
  * This is the chips component which will be rendered in the template
  */
  public chips: Chips;

  constructor (translateService: TranslateService) {
    super(translateService);
  }

 /**
  * Initializes chips only for the rendered index value if indexToBeRendered is set or
  * it initializes chips for all values.
  */
  ngOnInit() {
    if ( this.indexToBeRendered > 0 ) {
      this.initChips([this.metadataValues[this.indexToBeRendered]]);
    } else {
      this.initChips(this.metadataValues);
    }
  }

 /**
  * Creates the chips component with the required values
  * @params initChipsValues values to be rendered in chip items
  */
  private initChips(initChipsValues: string[]): void {
    this.chips = new Chips(initChipsValues,'value');
  }
}
