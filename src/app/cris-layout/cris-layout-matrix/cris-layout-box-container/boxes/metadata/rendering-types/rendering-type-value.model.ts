import {
  Component,
  Inject,
  Input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LayoutField } from '../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../../core/shared/metadata.models';
import { RenderingTypeModelComponent } from './rendering-type.model';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
@Component({
  template: '',
  standalone: true,
})
export abstract class RenderingTypeValueModelComponent extends RenderingTypeModelComponent {

  /**
   * Current metadata value to render
   */
  @Input() metadataValue: MetadataValue;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: MetadataValue,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
  ) {
    super(translateService);
    this.field = fieldProvider;
    this.item = itemProvider;
    this.metadataValue = metadataValueProvider;
    this.renderingSubType = renderingSubTypeProvider;
    this.tabName = tabNameProvider;
  }

  /**
   * Purge all HTML tags, then replace newline character with <br>
   * @param text
   */
  formatText(text: string): string {
    const newlineRegex = /\n/g;
    return text.replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(newlineRegex, '<br>');
  }

}
