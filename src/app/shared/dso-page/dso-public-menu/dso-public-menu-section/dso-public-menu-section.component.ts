/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractMenuSectionComponent } from 'src/app/shared/menu/menu-section/abstract-menu-section.component';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { MenuService } from '../../../menu/menu.service';
import { MenuID } from '../../../menu/menu-id.model';
import { rendersSectionForMenu } from '../../../menu/menu-section.decorator';
import { ThemeService } from '../../../theme-support/theme.service';

/**
 * Represents a non-expandable section in the dso public menus
 */
@Component({
  selector: 'ds-dso-public-menu-section',
  templateUrl: './dso-public-menu-section.component.html',
  styleUrls: ['./dso-public-menu-section.component.scss'],
  imports: [
    BtnDisabledDirective,
    NgbTooltip,
    RouterLink,
    TranslateModule,
  ],
})
@rendersSectionForMenu(MenuID.DSO_PUBLIC, false)
export class DsoPublicMenuSectionComponent extends AbstractMenuSectionComponent implements OnInit {

  menuID: MenuID = MenuID.DSO_PUBLIC;
  hasLink: boolean;
  canActivate: boolean;

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
  ) {
    super(
      menuService,
      injector,
      themeService,
    );
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
