import {
  AsyncPipe,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { slide } from '../../shared/animations/slide';
import { HostWindowService } from '../../shared/host-window.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
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
  imports: [VarDirective, RouterLinkActive, NgComponentOutlet, NgIf, NgFor, AsyncPipe],
})
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

  constructor(@Inject('sectionDataProvider') menuSection,
              protected menuService: MenuService,
              protected injector: Injector,
              private windowService: HostWindowService,
  ) {
    super(menuSection, menuService, injector);
    this.isMobile$ = this.windowService.isMobile();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * When the mouse enters the section toggler activate the menu section
   * @param $event
   * @param isActive
   */
  onMouseEnter($event: Event, isActive: boolean) {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      if (!isMobile && !isActive && !this.mouseEntered) {
        this.activateSection($event);
      }
      this.mouseEntered = true;
    });
  }

  /**
   * When the mouse leaves the section toggler deactivate the menu section
   * @param $event
   * @param isActive
   */
  onMouseLeave($event: Event, isActive: boolean) {
    this.isMobile$.pipe(
      first(),
    ).subscribe((isMobile) => {
      if (!isMobile && isActive && this.mouseEntered) {
        this.deactivateSection($event);
      }
      this.mouseEntered = false;
    });
  }

  /**
   * returns the ID of the DOM element representing the navbar section
   * @param sectionId
   */
  expandableNavbarSectionId(sectionId: string) {
    return `expandable-navbar-section-${sectionId}-dropdown`;
  }
}
