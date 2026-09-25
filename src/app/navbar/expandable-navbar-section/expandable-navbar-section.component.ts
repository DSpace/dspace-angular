import {
  AsyncPipe,
  NgComponentOutlet,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewChecked,
  Component,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import {
  from,
  Observable,
} from 'rxjs';
import {
  first,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  toArray,
} from 'rxjs/operators';

import { slide } from '../../shared/animations/slide';
import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
import { MenuItemModel } from '../../shared/menu/menu-item/models/menu-item.model';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { MenuSectionComponentDTO } from '../../shared/menu/menu-section/abstract-menu-section.component';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { HoverOutsideDirective } from '../../shared/utils/hover-outside.directive';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';

/**
 * A sub-section together with the component and injector needed to render it via {@link NgComponentOutlet}.
 */
export interface ExpandableSubSection extends MenuSectionComponentDTO {
  section: MenuSection;
}

/**
 * Represents an expandable section in the navbar
 */
@Component({
  selector: 'ds-expandable-navbar-section',
  templateUrl: './expandable-navbar-section.component.html',
  styleUrls: ['./expandable-navbar-section.component.scss'],
  animations: [slide],
  imports: [
    AsyncPipe,
    HoverOutsideDirective,
    NgComponentOutlet,
    NgTemplateOutlet,
    RouterLinkActive,
  ],
})
@rendersSectionForMenu(MenuID.PUBLIC, true)
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements AfterViewChecked, OnInit, OnDestroy {

  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  /**
   * True if mouse has entered the menu section toggler
   */
  mouseEntered = false;

  /**
   * Whether the section was expanded
   */
  focusOnFirstChildSection = false;

  /**
   * True if screen size was small before a resize event
   */
  wasMobile = undefined;

  /**
   * Observable that emits true if the screen is small, false otherwise
   */
  isMobile$: Observable<boolean>;

  /**
   * Boolean used to add the event listeners to the items in the expandable menu when expanded. This is done for
   * performance reasons, there is currently an *ngIf on the menu to prevent the {@link HoverOutsideDirective} to tank
   * performance when not expanded.
   */
  addArrowEventListeners = false;

  /**
   * List of current dropdown items who have event listeners
   */
  private dropdownItems: NodeListOf<HTMLElement>;

  /**
   * Emits true when the top section has subsections, else emits false
   */
  hasSubSections$: Observable<boolean>;

  /**
   * Cache of resolved sub-section component observables, keyed by parent section id.
   */
  private subSectionComponentsCache = new Map<string, Observable<ExpandableSubSection[]>>();

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      // When switching between desktop and mobile active sections should be deactivated
      if (isMobile !== this.wasMobile) {
        this.wasMobile = isMobile;
        this.menuService.deactivateSection(this.menuID, this.section.id);
        this.mouseEntered = false;
      }
    });
  }

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
    protected windowService: HostWindowService,
  ) {
    super(
      menuService,
      injector,
      themeService,
    );
    this.isMobile$ = this.windowService.isMobile();
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasSubSections$ = this.subSections$.pipe(
      map((subSections) => isNotEmpty(subSections)),
    );
    this.subs.push(this.active$.subscribe((active: boolean) => {
      if (active === true) {
        this.addArrowEventListeners = true;
      } else {
        this.focusOnFirstChildSection = undefined;
        this.unsubscribeFromEventListeners();
      }
    }));
  }

  ngAfterViewChecked(): void {
    if (this.addArrowEventListeners) {
      this.dropdownItems = document.querySelectorAll(`#${this.expandableNavbarSectionId()} *[role="menuitem"]`);
      this.dropdownItems.forEach((item: HTMLElement) => {
        item.addEventListener('keydown', this.navigateDropdown.bind(this));
      });
      if (this.focusOnFirstChildSection && this.dropdownItems.length > 0) {
        this.dropdownItems.item(0).focus();
      }
      this.addArrowEventListeners = false;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribeFromEventListeners();
  }

  /**
   * Activate this section if it's currently inactive, deactivate it when it's currently active.
   * Also saves whether this toggle was performed by a keyboard event (non-click event) in order to know if thi first
   * item should be focussed when activating a section.
   *
   *  @param {Event} event The user event that triggered this method
   */
  override toggleSection(event: Event): void {
    this.focusOnFirstChildSection = event.type !== 'click';
    super.toggleSection(event);
  }

  /**
   * Removes all the current event listeners on the dropdown items (called when the menu is closed & on component
   * destruction)
   */
  unsubscribeFromEventListeners(): void {
    if (this.dropdownItems) {
      this.dropdownItems.forEach((item: HTMLElement) => {
        item.removeEventListener('keydown', this.navigateDropdown.bind(this));
      });
      this.dropdownItems = undefined;
    }
  }

  /**
   * When the mouse enters the section toggler activate the menu section
   * @param $event
   */
  onMouseEnter($event: Event): void {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      if (!isMobile && !this.active$.value && !this.mouseEntered) {
        this.activateSection($event);
      }
      this.mouseEntered = true;
    });
  }

  /**
   * When the mouse leaves the section toggler deactivate the menu section
   * @param $event
   */
  onMouseLeave($event: Event): void {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      if (!isMobile && this.active$.value && this.mouseEntered) {
        this.deactivateSection($event);
      }
      this.mouseEntered = false;
    });
  }

  /**
   * returns the ID of the DOM element representing the navbar section
   */
  expandableNavbarSectionId(): string {
    return `expandable-navbar-section-${this.section.id}-dropdown`;
  }

  /**
   * Handles the navigation between the menu items
   *
   * @param event
   */
  navigateDropdown(event: KeyboardEvent): void {
    if (event.code === 'Tab') {
      this.deactivateSection(event, false);
      return;
    } else if (event.code === 'Escape') {
      this.deactivateSection(event, false);
      (document.querySelector(`a[aria-controls="${this.expandableNavbarSectionId()}"]`) as HTMLElement)?.focus();
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const items: NodeListOf<Element> = document.querySelectorAll(`#${this.expandableNavbarSectionId()} *[role="menuitem"]`);
    if (items.length === 0) {
      return;
    }
    const currentIndex: number = Array.from(items).findIndex((item: Element) => item === event.target);

    if (event.key === 'ArrowDown') {
      (items[(currentIndex + 1) % items.length] as HTMLElement).focus();
    } else if (event.key === 'ArrowUp') {
      (items[(currentIndex - 1 + items.length) % items.length] as HTMLElement).focus();
    }
  }

  /**
   * Resolve the visible sub-sections of a given parent section, together with the component and injector required to
   * render each of them through {@link NgComponentOutlet}.
   *
   * This is used by the recursive sub-section template so that every level of the tree is rendered by the regular menu
   * item components (e.g. {@link LinkMenuItemComponent}, {@link TextMenuItemComponent}) instead of inlined markup.
   *
   * @param parentID the id of the parent section whose children should be resolved
   */
  getSubSectionComponents(parentID: string): Observable<ExpandableSubSection[]> {
    if (!this.subSectionComponentsCache.has(parentID)) {
      this.subSectionComponentsCache.set(parentID, this.buildSubSectionComponents(parentID).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
      ));
    }
    return this.subSectionComponentsCache.get(parentID);
  }

  /**
   * Build the observable of resolved sub-sections for a parent section. See {@link getSubSectionComponents}.
   *
   * @param parentID the id of the parent section whose children should be resolved
   */
  private buildSubSectionComponents(parentID: string): Observable<ExpandableSubSection[]> {
    return this.menuService.getSubSectionsByParentID(this.menuID, parentID).pipe(
      switchMap((sections: MenuSection[]) => from(sections).pipe(
        mergeMap((section: MenuSection) => from(this.getMenuItemComponent(section.model)).pipe(
          map((component: GenericConstructor<Component>) => ({
            section,
            component,
            injector: this.getSubSectionInjector(section.model),
          })),
        )),
        toArray(),
        map((resolved: ExpandableSubSection[]) => sections
          .map((section: MenuSection) => resolved.find((dto: ExpandableSubSection) => dto.section.id === section.id))
          .filter((dto: ExpandableSubSection) => isNotEmpty(dto)),
        ),
      )),
    );
  }

  /**
   * Create an {@link Injector} that provides the given item model to the dynamically rendered menu item component.
   *
   * @param itemModel the model to provide to the rendered menu item component
   */
  private getSubSectionInjector(itemModel: MenuItemModel): Injector {
    return Injector.create({
      providers: [{ provide: 'itemModelProvider', useFactory: () => itemModel, deps: [] }],
      parent: this.injector,
    });
  }


  /**
   * Handles all the keydown events on the dropdown toggle
   *
   * @param event
   */
  keyDown(event: KeyboardEvent): void {
    switch (event.code) {
      // Works for both Tab & Shift Tab
      case 'Tab':
        this.deactivateSection(event, false);
        break;
      case 'ArrowDown':
        this.focusOnFirstChildSection = true;
        this.activateSection(event);
        break;
      case 'Space':
      case 'Enter':
        event.preventDefault();
        break;
    }
  }
}
