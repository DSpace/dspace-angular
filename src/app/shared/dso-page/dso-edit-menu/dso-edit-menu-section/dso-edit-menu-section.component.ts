
import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractMenuSectionComponent } from 'src/app/shared/menu/menu-section/abstract-menu-section.component';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { isNotEmpty } from '../../../empty.util';
import { MenuService } from '../../../menu/menu.service';
import { MenuID } from '../../../menu/menu-id.model';
import { MenuSection } from '../../../menu/menu-section.model';

/**
 * Represents a non-expandable section in the dso edit menus
 */
@Component({
  selector: 'ds-dso-edit-menu-section',
  templateUrl: './dso-edit-menu-section.component.html',
  styleUrls: ['./dso-edit-menu-section.component.scss'],
  standalone: true,
  imports: [
    BtnDisabledDirective,
    NgbTooltipModule,
    RouterLink,
    TranslateModule,
  ],
})
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
   * Activate the section's model function
   */
  public activate(event: any) {
    event.preventDefault();
    if (!this.itemModel.disabled) {
      this.itemModel.function();
    }
    event.stopPropagation();
  }
}
