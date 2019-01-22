import { Component, Injector } from '@angular/core';
import { MenuService } from '../menu.service';
import { MenuSection } from '../menu.reducer';
import { getComponentForMenuItemType } from '../menu-item.decorator';
import { MenuID, MenuItemType } from '../initial-menus-state';
import { hasNoValue } from '../../empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { MenuItemModel } from '../menu-item/models/menu-item.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { GenericConstructor } from '../../../core/shared/generic-constructor';

/**
 * A basic implementation of a menu section's component
 */
@Component({
  selector: 'ds-menu-section',
  template: ''
})
export class MenuSectionComponent {

  /**
   * Observable that emits whether or not this section is currently active
   */
  active: Observable<boolean>;

  /**
   * The ID of the menu this section resides in
   */
  menuID: MenuID;

  /**
   * List of Injectors for each dynamically rendered menu item of this section
   */
  itemInjectors: Map<string, Injector> = new Map<string, Injector>();

  /**
   * List of child Components for each dynamically rendered menu item of this section
   */
  itemComponents: Map<string, GenericConstructor<MenuSectionComponent>> = new Map<string, GenericConstructor<MenuSectionComponent>>();

  /**
   * List of available subsections in this section
   */
  subSections: Observable<MenuSection[]>;

  constructor(public section: MenuSection, protected menuService: MenuService, protected injector: Injector) {
  }

  /**
   * Set initial values for instance variables
   */
  ngOnInit(): void {
    this.active = this.menuService.isSectionActive(this.menuID, this.section.id).pipe(distinctUntilChanged());
    this.initializeInjectorData();
  }

  /**
   * Activate this section if it's currently inactive, deactivate it when it's currently active
   * @param {Event} event The user event that triggered this method
   */
  toggleSection(event: Event) {
    event.preventDefault();
    this.menuService.toggleActiveSection(this.menuID, this.section.id);
  }

  /**
   * Activate this section
   * @param {Event} event The user event that triggered this method
   */
  activateSection(event: Event) {
    event.preventDefault();
    this.menuService.activateSection(this.menuID, this.section.id);
  }

  /**
   * Deactivate this section
   * @param {Event} event The user event that triggered this method
   */
  deactivateSection(event: Event) {
    event.preventDefault();
    this.menuService.deactivateSection(this.menuID, this.section.id);
  }

  /**
   * Method for initializing all injectors and component constructors for the menu items in this section
   */
  private initializeInjectorData() {
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

  /**
   * Retrieve the component for a given MenuItemModel object
   * @param {MenuItemModel} itemModel The given MenuItemModel
   * @returns {GenericConstructor} Emits the constructor of the Component that should be used to render this menu item model
   */
  private getMenuItemComponent(itemModel?: MenuItemModel) {
    if (hasNoValue(itemModel)) {
      itemModel = this.section.model;
    }
    const type: MenuItemType = itemModel.type;
    return getComponentForMenuItemType(type);
  }

  /**
   * Retrieve the Injector for a given MenuItemModel object
   * @param {MenuItemModel} itemModel The given MenuItemModel
   * @returns {Injector} The Injector that injects the data for this menu item into the item's component
   */
  private getItemModelInjector(itemModel?: MenuItemModel) {
    if (hasNoValue(itemModel)) {
      itemModel = this.section.model;
    }
    return Injector.create({
      providers: [{ provide: 'itemModelProvider', useFactory: () => (itemModel), deps: [] }],
      parent: this.injector
    });
  }

}
