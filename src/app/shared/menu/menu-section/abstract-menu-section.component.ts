import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';

import { GenericConstructor } from '../../../core/shared/generic-constructor';
import {
  hasNoValue,
  hasValue,
} from '../../empty.util';
import { ThemeService } from '../../theme-support/theme.service';
import { MenuService } from '../menu.service';
import { MenuID } from '../menu-id.model';
import { getComponentForMenuItemType } from '../menu-item.decorator';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { MenuItemModel } from '../menu-item/models/menu-item.model';
import { MenuItemType } from '../menu-item-type.model';
import { MenuSection } from '../menu-section.model';

export interface MenuSectionDTO {
  injector: Injector;
  component: GenericConstructor<Component>;
}

/**
 * A basic implementation of a menu section's component
 */
@Component({
  selector: 'ds-menu-section',
  template: '',
  standalone: true,
})
export abstract class AbstractMenuSectionComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Whether the menu is expandable
   */
  @Input() expandable: boolean;

  /**
   * The ID of the menu this section resides in
   */
  @Input() menuID: MenuID;

  /**
   * The section data
   */
  @Input() section: MenuSection;

  /**
   * {@link BehaviorSubject} containing the current state to whether this section is currently active
   */
  active$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  itemModel;

  /**
   * List of available subsections in this section
   */
  subSections$: Observable<MenuSection[]>;

  /**
   * Map of components and injectors for each dynamically rendered menu section
   */
  sectionMap: WritableSignal<Map<string, MenuSectionDTO>> = signal(new Map<string, MenuSectionDTO>());

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  subs: Subscription[] = [];

  protected constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
  ) {
  }

  /**
   * Set initial values for instance variables
   */
  ngOnInit(): void {
    this.subs.push(this.menuService.isSectionActive(this.menuID, this.section.id).pipe(distinctUntilChanged()).subscribe((isActive: boolean) => {
      if (this.active$.value !== isActive) {
        this.active$.next(isActive);
      }
    }));
    this.initializeInjectorData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasValue(changes.section)) {
      this.itemModel = this.section.model as LinkMenuItemModel;
    }
  }

  /**
   * Activate this section if it's currently inactive, deactivate it when it's currently active
   * @param {Event} event The user event that triggered this method
   */
  toggleSection(event: Event) {
    event.preventDefault();
    if (!this.section.model?.disabled) {
      this.menuService.toggleActiveSection(this.menuID, this.section.id);
    }
  }

  /**
   * Activate this section
   * @param {Event} event The user event that triggered this method
   * @param skipEvent Weather the event should still be triggered after deactivating the section or not
   */
  activateSection(event: Event, skipEvent = true): void {
    if (skipEvent) {
      event.preventDefault();
    }
    if (!this.section.model?.disabled) {
      this.menuService.activateSection(this.menuID, this.section.id);
    }
  }

  /**
   * Deactivate this section
   *
   * @param {Event} event The user event that triggered this method
   * @param skipEvent Weather the event should still be triggered after deactivating the section or not
   */
  deactivateSection(event: Event, skipEvent = true): void {
    if (skipEvent) {
      event.preventDefault();
    }
    this.menuService.deactivateSection(this.menuID, this.section.id);
  }

  /**
   * Method for initializing all injectors and component constructors for the menu items in this section
   */
  private initializeInjectorData() {
    // We need to await the component resolution before calling updateSectionMap
    void this.getMenuItemComponent(this.section.model).then((component: GenericConstructor<Component>) => {
      this.updateSectionMap(
        this.section.id,
        this.getItemModelInjector(this.section.model),
        component,
      );
    });

    this.subSections$ = this.menuService.getSubSectionsByParentID(this.menuID, this.section.id);
    this.subs.push(
      this.subSections$.pipe(
        // if you return an array from a switchMap it will emit each element as a separate event.
        // So this switchMap is equivalent to a subscribe with a forEach inside
        switchMap((sections: MenuSection[]) => sections),
        mergeMap((section: MenuSection) => from(this.getMenuItemComponent(section.model)).pipe(
          map((component: GenericConstructor<Component>) => ({ section, component })),
        )),
      ).subscribe(({ section, component }) => {
        this.updateSectionMap(
          section.id,
          this.getItemModelInjector(section.model),
          component,
        );
      }),
    );
  }

  /**
   * Update the sectionMap
   */
  private updateSectionMap(id: string, injector: Injector, component: GenericConstructor<Component>) {
    this.sectionMap.update((sectionMap: Map<string, MenuSectionDTO>) => new Map(sectionMap.set(id, {
      injector,
      component,
    })));
  }

  /**
   * Retrieve the component for a given MenuItemModel object
   * @param {MenuItemModel} itemModel The given MenuItemModel
   * @returns {Promise<GenericConstructor>} Emits the constructor of the Component that should be used to render this menu item model
   */
  getMenuItemComponent(itemModel?: MenuItemModel): Promise<GenericConstructor<Component>> {
    if (hasNoValue(itemModel)) {
      itemModel = this.section.model;
    }
    const type: MenuItemType = itemModel.type;
    return getComponentForMenuItemType(type, this.themeService.getThemeName());
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
      parent: this.injector,
    });
  }

  /**
   * Unsubscribe from open subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
