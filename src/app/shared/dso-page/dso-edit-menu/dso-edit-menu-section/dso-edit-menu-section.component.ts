
import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { WidthCategory } from '@dspace/core/shared/host-window-type';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AbstractMenuSectionComponent } from 'src/app/shared/menu/menu-section/abstract-menu-section.component';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { HostWindowService } from '../../../host-window.service';
import { MenuService } from '../../../menu/menu.service';
import { MenuID } from '../../../menu/menu-id.model';
import { rendersSectionForMenu } from '../../../menu/menu-section.decorator';
import { ThemeService } from '../../../theme-support/theme.service';

/**
 * Represents a non-expandable section in the dso edit menus
 */
@Component({
  selector: 'ds-dso-edit-menu-section',
  templateUrl: './dso-edit-menu-section.component.html',
  styleUrls: ['./dso-edit-menu-section.component.scss'],
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgbTooltip,
    RouterLink,
    TranslateModule,
  ],
})
@rendersSectionForMenu(MenuID.DSO_EDIT, false)
export class DsoEditMenuSectionComponent extends AbstractMenuSectionComponent implements OnInit {

  menuID: MenuID = MenuID.DSO_EDIT;
  hasLink: boolean;
  canActivate: boolean;
  public isMobile$: Observable<boolean>;

  maxMobileWidth = WidthCategory.SM;

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
    this.isMobile$ = this.windowService.isUpTo(this.maxMobileWidth);
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
