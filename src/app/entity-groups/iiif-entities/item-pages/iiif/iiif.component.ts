import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Component, OnInit } from '@angular/core';
import {ItemComponent} from '../../../../item-page/simple/item-types/shared/item.component';

@listableObjectComponent('IIIF', ViewMode.StandalonePage)
@Component({
  selector: 'ds-iiif',
  styleUrls: ['./iiif.component.scss'],
  templateUrl: './iiif.component.html'
})

export class IIIFComponent extends ItemComponent implements OnInit {

  searchable;

  /**
   * Load iiif viewer in no search configuration.
   */
  ngOnInit(): void {
    this.searchable = false;
  }

}
