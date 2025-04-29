import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  AfterViewChecked,
  Component,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import { slide } from '../../shared/animations/slide';
import { isNotEmpty } from '../../shared/empty.util';
import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { HoverOutsideDirective } from '../../shared/utils/hover-outside.directive';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';

/**
 * Represents an expandable section in the navbar
 */
@Component({
  selector: 'ds-base-expandable-navbar-section',
  templateUrl: './expandable-navbar-section.component.html',
  styleUrls: ['./expandable-navbar-section.component.scss'],
  animations: [slide],
  standalone: true,
  imports: [
    AsyncPipe,
    HoverOutsideDirective,
    NgComponentOutlet,
    RouterLinkActive,
  ],
})
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
    @Inject('sectionDataProvider') public section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    protected windowService: HostWindowService,
  ) {
    super(section, menuService, injector);
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
