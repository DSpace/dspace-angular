import { Component, Injector, Input } from '@angular/core';
import { MenuService } from '../menu.service';
import { MenuSection } from '../menu.reducer';
import { getComponentForSectionType } from '../menu-section.decorator';
import { MenuID, SectionType } from '../initial-menus-state';
import { hasNoValue, hasValue } from '../../empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { SectionTypeModel } from '../models/section-types/section-type.model';

@Component({
  selector: 'ds-menu-section',
  template: ''
})
export class MenuSectionComponent {
  active: Observable<boolean>;
  menuID: MenuID;

  constructor(protected section: MenuSection, protected menuService: MenuService, protected injector: Injector) {
  }

  ngOnInit(): void {
    this.active = this.menuService.isSectionActive(this.menuID, this.section.id);
  }

  toggleSection(event: Event) {
    event.preventDefault();
    this.menuService.toggleActiveSection(this.menuID, this.section.id);
  }

  getMenuItemComponent(itemModel?: SectionTypeModel) {
    if (hasNoValue(itemModel)) {
      itemModel = this.section.model;
    }
    const type: SectionType = itemModel.type;
    return getComponentForSectionType(type);
  }

  getItemModelInjector(itemModel?: SectionTypeModel) {
    if (hasNoValue(itemModel)) {
      itemModel = this.section.model;
    }
    return Injector.create({
      providers: [{ provide: 'itemModelProvider', useFactory: () => (itemModel), deps: [] }],
      parent: this.injector
    });
  }

}
