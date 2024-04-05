import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../../metadata-box.decorator';
import { Item } from '../../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders the inline  metadata group fields
 */
@Component({
  selector: 'ds-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.INLINE, true)
export class InlineComponent extends MetadataGroupComponent implements OnInit {

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

}
