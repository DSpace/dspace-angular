import { Component, Inject, Input } from '@angular/core';
import { LinkSectionTypeModel } from '../models/section-types/link.model';
import { SectionType } from '../initial-menus-state';
import { rendersSectionForType } from '../menu-section.decorator';

@Component({
  selector: 'ds-link-type-menu-item',
  templateUrl: './link-type.component.html'
})
@rendersSectionForType(SectionType.LINK)
export class LinkTypeMenuItemComponent {
  @Input() item: LinkSectionTypeModel;
  constructor(@Inject('itemModelProvider') item) {
    this.item = item;
  }
}
