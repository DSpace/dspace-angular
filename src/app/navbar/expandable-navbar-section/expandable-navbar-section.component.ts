import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';
import { MenuService } from '../../shared/menu/menu.service';
import { slide } from '../../shared/animations/slide';
import { first, map } from 'rxjs/operators';
import { HostWindowService } from '../../shared/host-window.service';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { MenuID } from '../../shared/menu/menu-id.model';
import { Observable } from 'rxjs';
import { isNotEmpty } from '../../shared/empty.util';

/**
 * Represents an expandable section in the navbar
 */
@Component({
  selector: 'ds-expandable-navbar-section',
  templateUrl: './expandable-navbar-section.component.html',
  styleUrls: ['./expandable-navbar-section.component.scss'],
  animations: [slide]
})
@rendersSectionForMenu(MenuID.PUBLIC, true)
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements OnInit {
  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  /**
   * Emits true when the top section has subsections, else emits false
   */
  hasSubSections$: Observable<boolean>;

  constructor(
    @Inject('sectionDataProvider') protected section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    private windowService: HostWindowService,
  ) {
    super(section, menuService, injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.hasSubSections$ = this.subSections$.pipe(
      map((subSections) => isNotEmpty(subSections))
    );
  }

  /**
   * Overrides the super function that activates this section (triggered on hover)
   * Has an extra check to make sure the section can only be activated on non-mobile devices
   * @param {Event} event The user event that triggered this function
   */
  activateSection(event): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        super.activateSection(event);
      }
    });
  }

  /**
   * Overrides the super function that deactivates this section (triggered on hover)
   * Has an extra check to make sure the section can only be deactivated on non-mobile devices
   * @param {Event} event The user event that triggered this function
   */
  deactivateSection(event): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        super.deactivateSection(event);
      }
    });
  }

  /**
   * Overrides the super function that toggles this section (triggered on click)
   * Has an extra check to make sure the section can only be toggled on mobile devices
   * @param {Event} event The user event that triggered this function
   */
  toggleSection(event): void {
    event.preventDefault();
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (isMobile) {
        super.toggleSection(event);
      }
    });
  }
}
