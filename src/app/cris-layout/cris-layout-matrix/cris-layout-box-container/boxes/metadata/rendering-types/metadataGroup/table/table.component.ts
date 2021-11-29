import { Component, ComponentFactoryResolver, Inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../../metadata-box.decorator';
import { Item } from '../../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { MetadataGroupComponent } from '../metadata-group.component';

/**
 * This component renders the table  metadata group fields
 */
@Component({
  selector: 'ds-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.TABLE, true)
export class TableComponent extends MetadataGroupComponent {

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, translateService);
  }

}
