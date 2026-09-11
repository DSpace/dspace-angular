
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  DynamicLayoutBox,
  MetadataBoxConfiguration,
} from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';

import { RenderDynamicLayoutBoxFor } from '../../../../decorators/dynamic-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { DynamicLayoutBoxDirective } from '../../../../models/dynamic-layout-box-component.directive';
import { RowComponent } from './row/row.component';

/**
 * This component renders the metadata boxes of items
 */
@RenderDynamicLayoutBoxFor(LayoutBox.METADATA)
@Component({
  selector: 'ds-dynamic-layout-metadata-box',
  templateUrl: './dynamic-layout-metadata-box.component.html',
  styleUrls: ['./dynamic-layout-metadata-box.component.scss'],
  imports: [
    RowComponent,
  ],
})
/**
 * For overwrite this component create a new one that extends DynamicLayoutBoxObj and
 * add the DynamicLayoutBoxModelComponent decorator indicating the type of box to overwrite
 */
export class DynamicLayoutMetadataBoxComponent extends DynamicLayoutBoxDirective implements OnInit {

  /**
   * Contains the fields configuration for current box
   */
  metadataBoxConfiguration: MetadataBoxConfiguration;


  constructor(
    public cdr: ChangeDetectorRef,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: DynamicLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setMetadataComponents(this.box.configuration as MetadataBoxConfiguration);
  }

  /**
   * Set the metadataBoxConfiguration.
   * @param metadatacomponents
   */
  setMetadataComponents(metadatacomponents: MetadataBoxConfiguration) {
    this.metadataBoxConfiguration = metadatacomponents;
    this.cdr.detectChanges();
  }

}
