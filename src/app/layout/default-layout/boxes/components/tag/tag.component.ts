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

  constructor (translateService: TranslateService) {
    super(translateService);
  }

  public chips: Chips;

  private subs: Subscription[] = [];

  ngOnInit() {
    if ( this.indexToBeRendered > 0 ) {
      this.initChips([this.metadataValues[this.indexToBeRendered]]);
    } else {
      this.initChips(this.metadataValues);
    }
  }

  private initChips(initChipsValue) {
    this.chips = new Chips(initChipsValue,'value');
  }
}
