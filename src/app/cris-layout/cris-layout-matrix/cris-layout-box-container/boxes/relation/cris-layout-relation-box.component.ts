import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { CrisLayoutBox } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { Box, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-relation-box.component.html',
  styleUrls: ['./cris-layout-relation-box.component.scss']
})
@CrisLayoutBox(LayoutBox.RELATION)
export class CrisLayoutRelationBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Name of configuration for this box
   */
  configuration: string;
  /**
   * flag for enable/disable search bar
   */
  searchEnabled = false;
  /**
   * The width of the sidebar (bootstrap columns)
   */
  // sideBarWidth = 3;

  constructor(public cd: ChangeDetectorRef,
              protected translateService: TranslateService,
              protected viewRef: ElementRef,
              @Inject('boxProvider') public boxProvider: Box,
              @Inject('itemProvider') public itemProvider: Item) {
    super(translateService, viewRef, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchFilter = `scope=${this.item.id}`;
    console.log(this.box);
    this.configuration = (this.box.configuration as RelationBoxConfiguration)['discovery-configuration'];
  }

}
