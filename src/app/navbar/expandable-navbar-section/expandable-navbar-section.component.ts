import { AnimationEvent } from '@angular/animations';
import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  HostListener,
  Injector,
  OnInit,
} from '@angular/core';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import { slide } from '../../shared/animations/slide';
import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { HoverOutsideDirective } from '../../shared/utils/hover-outside.directive';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';

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
  ],
})
@rendersSectionForMenu(MenuID.PUBLIC, true)
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements OnInit {

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
   * Emits true when the top section has subsections, else emits false
   */
  hasSubSections$: Observable<boolean>;

  /**
   * When true, the dropdown has Bootstrap's `.show` class (display:block).
   * Set as soon as the section activates so the open animation can run;
   * cleared only after the collapse animation finishes so the close can slide.
   */
  dropdownShown = false;

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
    this.subs.push(
      this.active$.subscribe((active) => {
        if (active) {
          this.dropdownShown = true;
        }
      }),
    );
  }

  /**
   * Hide the dropdown only after the collapse slide has finished.
   */
  finishSlide(event: AnimationEvent): void {
    if (event.toState === 'collapsed') {
      this.dropdownShown = false;
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
   * Prevent the browser from also synthesizing a click on Enter/Space.
   * Activation is handled by the (keyup.enter)/(keyup.space) bindings so NVDA
   * does not toggle the section twice: https://www.nvaccess.org/
   */
  keyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
      case 'Enter':
        event.preventDefault();
        break;
    }
  }

  /**
   * Closes the open dropdown and puts the focus back on the toggle
   */
  closeDropdownAndFocusToggle(event: KeyboardEvent): void {
    (document.querySelector(`button[aria-controls="${this.expandableNavbarSectionId()}"]`) as HTMLElement)?.focus();
    this.deactivateSection(event, false);
  }
}
