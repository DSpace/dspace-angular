import {
  Directive,
  Inject,
} from '@angular/core';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';

import { RenderingTypeDirective } from './rendering-type.directive';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
@Directive()
export abstract class RenderingTypeStructuredDirective extends RenderingTypeDirective {

  static override structured = true;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
  ) {
    super(translateService);
    this.field = fieldProvider;
    this.item = itemProvider;
    this.renderingSubType = renderingSubTypeProvider;
    this.tabName = tabNameProvider;
  }

}
