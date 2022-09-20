import { Component, Inject, Injector } from '@angular/core';
import { MenuID } from 'src/app/shared/menu/initial-menus-state';
import { rendersSectionForMenu } from 'src/app/shared/menu/menu-section.decorator';
import { MenuSectionComponent } from 'src/app/shared/menu/menu-section/menu-section.component';
import { MenuService } from '../../../menu/menu.service';
import { MenuSection } from '../../../menu/menu.reducer';
import { Router } from '@angular/router';

/**
 * Represents an expandable section in the dso edit menus
 */
@Component({
  /* tslint:disable:component-selector */
  selector: 'ds-dso-edit-menu-expandable-section',
  templateUrl: './dso-edit-menu-expandable-section.component.html',
  styleUrls: ['./dso-edit-menu-expandable-section.component.scss'],
})
@rendersSectionForMenu(MenuID.DSO_EDIT, true)
export class DsoEditMenuExpandableSectionComponent extends MenuSectionComponent {

  menuID: MenuID = MenuID.DSO_EDIT;
  itemModel;

  constructor(
    @Inject('sectionDataProvider') menuSection: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    protected router: Router,
  ) {
    super(menuSection, menuService, injector);
    this.itemModel = menuSection.model;
  }

  ngOnInit(): void {
    this.menuService.activateSection(this.menuID, this.section.id);
    super.ngOnInit();
  }

}
