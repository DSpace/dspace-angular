import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuID } from 'src/app/shared/menu/menu-id.model';
import { MenuSection } from 'src/app/shared/menu/menu-section.model';
import { AbstractMenuSectionComponent } from 'src/app/shared/menu/menu-section/abstract-menu-section.component';

import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import {
  hasValue,
  isNotEmpty,
} from '../../../empty.util';
import { MenuService } from '../../../menu/menu.service';

/**
 * Represents an expandable section in the dso edit menus
 */
@Component({
  selector: 'ds-dso-edit-menu-expandable-section',
  templateUrl: './dso-edit-menu-expandable-section.component.html',
  styleUrls: ['./dso-edit-menu-expandable-section.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgbDropdownModule,
    NgbTooltipModule,
    NgComponentOutlet,
    TranslateModule,
  ],
})
export class DsoEditMenuExpandableSectionComponent extends AbstractMenuSectionComponent implements OnInit {

  /**
   * This section resides in the DSO edit menu
   */
  menuID: MenuID = MenuID.DSO_EDIT;


  /**
   * The MenuItemModel of the top section
   */
  itemModel;

  /**
   * Emits whether one of the subsections contains an icon
   */
  renderIcons$: Observable<boolean>;

  /**
   * Emits true when the top section has subsections, else emits false
   */
  hasSubSections$: Observable<boolean>;

  constructor(
    @Inject('sectionDataProvider') protected section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
    protected router: Router,
  ) {
    super(menuService, injector);
    this.itemModel = section.model;
  }

  ngOnInit(): void {
    this.menuService.activateSection(this.menuID, this.section.id);
    super.ngOnInit();

    this.renderIcons$ = this.subSections$.pipe(
      map((sections: MenuSection[]) => {
        return sections.some(section => hasValue(section.icon));
      }),
    );

    this.hasSubSections$ = this.subSections$.pipe(
      map((subSections) => isNotEmpty(subSections)),
    );

  }
}
