import { Component, Inject, Injector, OnInit } from '@angular/core';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/initial-menus-state';
import { rendersSectionForMenu } from '../../shared/menu/menu.decorator';
import { Observable } from 'rxjs/internal/Observable';
import { MenuSection } from '../../shared/menu/menu.reducer';
import { slide } from '../../shared/animations/slide';
import { first } from 'rxjs/operators';
import { HostWindowService } from '../../shared/host-window.service';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MenuSectionComponent } from '../../shared/menu/menu-section/menu-section.component';

@Component({
  selector: 'ds-expandable-navbar-section',
  templateUrl: './expandable-navbar-section.component.html',
  styleUrls: ['./expandable-navbar-section.component.scss'],
  animations: [slide]
})
@rendersSectionForMenu(MenuID.PUBLIC, true)
export class ExpandableNavbarSectionComponent extends NavbarSectionComponent implements OnInit {
  menuID = MenuID.PUBLIC;

  constructor(@Inject('sectionDataProvider') menuSection,
              protected menuService: MenuService,
              protected injector: Injector,
              private windowService: HostWindowService
  ) {
    super(menuSection, menuService, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  activateSection(event): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        super.activateSection(event);
      }
    });
  }

  deactivateSection(event): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        super.deactivateSection(event);
      }
    });
  }

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
