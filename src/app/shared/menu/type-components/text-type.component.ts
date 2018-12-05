import { Component, Inject, Input } from '@angular/core';
import { TextSectionTypeModel } from '../models/section-types/text.model';
import { SectionType } from '../initial-menus-state';
import { rendersSectionForType } from '../menu-section.decorator';

@Component({
  selector: 'ds-text-type-menu-item',
  templateUrl: './text-type.component.html',
})
@rendersSectionForType(SectionType.TEXT)
export class TextTypeMenuItemComponent {
  @Input() item: TextSectionTypeModel;
  constructor(@Inject('itemModelProvider') item) {
    this.item = item;
  }
}
