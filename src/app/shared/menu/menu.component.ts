import { ChangeDetectionStrategy, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MenuService } from './menu.service';
import { MenuID } from './initial-menus-state';
import { MenuSection } from './menu.reducer';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../empty.util';
import { MenuSectionComponent } from './menu-section/menu-section.component';
import { getComponentForMenu } from './menu-section.decorator';
import { Subscription } from 'rxjs/internal/Subscription';

/**
 * A basic implementation of a MenuComponent
 */
@Component({
  selector: 'ds-menu',
  template: ''
})
export class MenuComponent implements OnInit, OnDestroy {
  /**
   * The ID of the Menu (See MenuID)
   */
  menuID: MenuID;

  /**
   * Observable that emits whether or not this menu is currently collapsed
   */
  menuCollapsed: Observable<boolean>;

  /**
   * Observable that emits whether or not this menu's preview is currently collapsed
   */
  menuPreviewCollapsed: Observable<boolean>;

  /**
   * Observable that emits whether or not this menu is currently visible
   */
  menuVisible: Observable<boolean>;

  /**
   * List of top level sections in this Menu
   */
  sections: Observable<MenuSection[]>;

  /**
   * List of Injectors for each dynamically rendered menu section
   */
  sectionInjectors: Map<string, Injector> = new Map<string, Injector>();

  /**
   * List of child Components for each dynamically rendered menu section
   */
  sectionComponents: Map<string, GenericConstructor<MenuSectionComponent>> = new Map<string, GenericConstructor<MenuSectionComponent>>();

  /**
   * Prevent unnecessary rerendering
   */
  changeDetection: ChangeDetectionStrategy.OnPush;

  /**
   * Timer to briefly delay the sidebar preview from opening or closing
   */
  private previewTimer;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  subs: Subscription[] = [];

  constructor(protected menuService: MenuService, protected injector: Injector) {
  }

  /**
   * Sets all instance variables to their initial values
   */
  ngOnInit(): void {
    this.menuCollapsed = this.menuService.isMenuCollapsed(this.menuID);
    this.menuPreviewCollapsed = this.menuService.isMenuPreviewCollapsed(this.menuID);
    this.menuVisible = this.menuService.isMenuVisible(this.menuID);
    this.sections = this.menuService.getMenuTopSections(this.menuID).pipe(distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)));
    this.subs.push(this.sections.subscribe((sections: MenuSection[]) => {
      sections.forEach((section: MenuSection) => {
        this.sectionInjectors.set(section.id, this.getSectionDataInjector(section));
        this.getSectionComponent(section).pipe(first()).subscribe((constr) => this.sectionComponents.set(section.id, constr));
      });
    }));
  }

  /**
   *  Collapse this menu when it's currently expanded, expand it when its currently collapsed
   * @param {Event} event The user event that triggered this method
   */
  toggle(event: Event) {
    event.preventDefault();
    this.menuService.toggleMenu(this.menuID);
  }

  /**
   * Expand this menu
   * @param {Event} event The user event that triggered this method
   */
  expand(event: Event) {
    event.preventDefault();
    this.menuService.expandMenu(this.menuID);
  }

  /**
   * Collapse this menu
   * @param {Event} event The user event that triggered this method
   */
  collapse(event: Event) {
    event.preventDefault();
    this.menuService.collapseMenu(this.menuID);
  }

  /**
   * Expand this menu's preview
   * @param {Event} event The user event that triggered this method
   */
  expandPreview(event: Event) {
    event.preventDefault();
    this.previewToggleDebounce(() => this.menuService.expandMenuPreview(this.menuID), 100);
  }

  /**
   * Collapse this menu's preview
   * @param {Event} event The user event that triggered this method
   */
  collapsePreview(event: Event) {
    event.preventDefault();
    this.previewToggleDebounce(() => this.menuService.collapseMenuPreview(this.menuID), 400);
  }

  /**
   * delay the handler function by the given amount of time
   *
   * @param {Function} handler The function to delay
   * @param {number} ms The amount of ms to delay the handler function by
   */
  private previewToggleDebounce(handler: () => void, ms: number): void {
    if (hasValue(this.previewTimer)) {
      clearTimeout(this.previewTimer);
    }
    this.previewTimer = setTimeout(handler, ms);
  }

  /**
   * Retrieve the component for a given MenuSection object
   * @param {MenuSection} section The given MenuSection
   * @returns {Observable<GenericConstructor<MenuSectionComponent>>} Emits the constructor of the Component that should be used to render this object
   */
  private getSectionComponent(section: MenuSection): Observable<GenericConstructor<MenuSectionComponent>> {
    return this.menuService.hasSubSections(this.menuID, section.id).pipe(
      map((expandable: boolean) => {
          return getComponentForMenu(this.menuID, expandable);
        }
      ),
    );
  }

  /**
   * Retrieve the Injector for a given MenuSection object
   * @param {MenuSection} section The given MenuSection
   * @returns {Injector} The Injector that injects the data for this menu section into the section's component
   */
  private getSectionDataInjector(section: MenuSection) {
    return Injector.create({
      providers: [{ provide: 'sectionDataProvider', useFactory: () => (section), deps: [] }],
      parent: this.injector
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
