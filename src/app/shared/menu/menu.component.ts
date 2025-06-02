import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  combineLatest,
  from,
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../empty.util';
import { ThemeService } from '../theme-support/theme.service';
import { MenuService } from './menu.service';
import { MenuID } from './menu-id.model';
import { getComponentForMenu } from './menu-section.decorator';
import { MenuSection } from './menu-section.model';

export interface MenuSectionDTO {
  menuSection: MenuSection;
  hasSubSections: boolean;
}

/**
 * A basic implementation of a MenuComponent
 */
@Component({
  selector: 'ds-menu',
  template: '',
  standalone: true,
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
  sectionDTOs$: Observable<MenuSectionDTO[]>;

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

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    public authorizationService: AuthorizationDataService,
    public route: ActivatedRoute,
    protected themeService: ThemeService,
  ) {
  }

  /**
   * Sets all instance variables to their initial values
   */
  ngOnInit(): void {
    this.menuCollapsed = this.menuService.isMenuCollapsed(this.menuID);
    this.menuPreviewCollapsed = this.menuService.isMenuPreviewCollapsed(this.menuID);
    this.menuVisible = this.menuService.isMenuVisible(this.menuID);
    this.sectionDTOs$ = this.menuService.getMenuTopSections(this.menuID).pipe(
      switchMap((sections: MenuSection[]) => combineLatest(sections.map((section: MenuSection) => this.menuService.hasSubSections(this.menuID, section.id).pipe(
        map((hasSubsections: boolean) => ({
          menuSection: section,
          hasSubSections: hasSubsections,
        })),
      )))),
    );
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
   * @returns {Observable<GenericConstructor<AbstractMenuSectionComponent>>} Emits the constructor of the Component that should be used to render this object
   */
  getSectionComponent(section: MenuSection): Observable<GenericConstructor<Component>> {
    return this.menuService.hasSubSections(this.menuID, section.id).pipe(
      switchMap((expandable: boolean) => from(getComponentForMenu(this.menuID, expandable || section.alwaysRenderExpandable, this.themeService.getThemeName()))),
    );
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
