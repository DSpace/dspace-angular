import {
  AsyncPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { slide } from '../../shared/animations/slide';
import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { HoverOutsideDirective } from '../../shared/utils/hover-outside.directive';
import { VarDirective } from '../../shared/utils/var.directive';
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
    NgFor,
    NgIf,
    RouterLinkActive,
    VarDirective,
  ],
})
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements AfterViewChecked, OnInit {

  @ViewChild('expandableNavbarSectionContainer') expandableNavbarSection: ElementRef;

  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  /**
   * True if mouse has entered the menu section toggler
   */
  mouseEntered = false;

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
    this.subs.push(this.active$.subscribe((active: boolean) => {
      if (active === true) {
        this.addArrowEventListeners = true;
      }
    }));
  }

  ngAfterViewChecked(): void {
    if (this.addArrowEventListeners) {
      const dropdownItems = document.querySelectorAll(`#${this.expandableNavbarSectionId()} *[role="menuitem"]`);
      dropdownItems.forEach(item => {
        item.addEventListener('keydown', this.navigateDropdown.bind(this));
      });
      this.addArrowEventListeners = false;
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
    if (event.key === 'Tab') {
      this.deactivateSection(event, false);
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
        this.navigateDropdown(event);
        break;
      case 'Space':
        event.preventDefault();
        break;
    }
  }
}
