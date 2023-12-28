import { Component, Inject, Injector, OnInit } from '@angular/core';
import { rendersSectionForMenu } from 'src/app/shared/menu/menu-section.decorator';
import { AbstractMenuSectionComponent } from 'src/app/shared/menu/menu-section/abstract-menu-section.component';
import { MenuService } from '../../../menu/menu.service';
import { isNotEmpty } from '../../../empty.util';
import { MenuID } from '../../../menu/menu-id.model';
import { MenuSection } from '../../../menu/menu-section.model';

/**
 * Represents a non-expandable section in the dso edit menus
 */
@Component({
  /* tslint:disable:component-selector */
  selector: 'ds-dso-edit-menu-section',
  templateUrl: './dso-edit-menu-section.component.html',
  styleUrls: ['./dso-edit-menu-section.component.scss']
})
@rendersSectionForMenu(MenuID.DSO_EDIT, false)
export class DsoEditMenuSectionComponent extends AbstractMenuSectionComponent implements OnInit {

  menuID: MenuID = MenuID.DSO_EDIT;
  itemModel;
  hasLink: boolean;
  canActivate: boolean;

  constructor(
    @Inject('sectionDataProvider') protected section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
  ) {
    super(menuService, injector);
    this.itemModel = section.model;
  }

  ngOnInit(): void {
    this.hasLink = isNotEmpty(this.itemModel?.link);
    this.canActivate = isNotEmpty(this.itemModel?.function);
    super.ngOnInit();
  }

  /**
   * Activate the section's model funtion
   */
  public activate(event: any) {
    event.preventDefault();
    if (!this.itemModel.disabled) {
      this.itemModel.function();
    }
    event.stopPropagation();
  }
}
