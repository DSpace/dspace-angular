import { Component, Injector, Input } from '@angular/core';
import { MenuService } from '../menu.service';
import { MenuSection } from '../menu.reducer';
import { getComponentForSectionType } from '../menu-section.decorator';
import { MenuID, SectionType } from '../initial-menus-state';
import { hasNoValue, hasValue } from '../../empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { SectionTypeModel } from '../models/section-types/section-type.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { GenericConstructor } from '../../../core/shared/generic-constructor';

@Component({
  selector: 'ds-menu-section',
  template: ''
})
export class MenuSectionComponent {
  active: Observable<boolean>;
  menuID: MenuID;
  itemInjectors: Map<string, Injector> = new Map<string, Injector>();
  itemComponents: Map<string, GenericConstructor<MenuSectionComponent>> = new Map<string, GenericConstructor<MenuSectionComponent>>();
  subSections: Observable<MenuSection[]>;

  constructor(public section: MenuSection, protected menuService: MenuService, protected injector: Injector) {
  }

  ngOnInit(): void {
    this.active = this.menuService.isSectionActive(this.menuID, this.section.id).pipe(distinctUntilChanged());
    this.initializeInjectorData();
  }

  toggleSection(event: Event) {
    event.preventDefault();
    this.menuService.toggleActiveSection(this.menuID, this.section.id);
  }

  activateSection(event: Event) {
    event.preventDefault();
    this.menuService.activateSection(this.menuID, this.section.id);
  }

  deactivateSection(event: Event) {
    event.preventDefault();
    this.menuService.deactivateSection(this.menuID, this.section.id);
  }

  initializeInjectorData() {
    this.itemInjectors.set(this.section.id, this.getItemModelInjector(this.section.model));
    this.itemComponents.set(this.section.id, this.getMenuItemComponent(this.section.model));
    this.subSections = this.menuService.getSubSectionsByParentID(this.menuID, this.section.id);
    this.subSections.subscribe((sections: MenuSection[]) => {
      sections.forEach((section: MenuSection) => {
        this.itemInjectors.set(section.id, this.getItemModelInjector(section.model));
        this.itemComponents.set(section.id, this.getMenuItemComponent(section.model));
      })
    })
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
