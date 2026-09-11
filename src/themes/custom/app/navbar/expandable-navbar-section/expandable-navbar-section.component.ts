import {
  AsyncPipe,
  NgComponentOutlet,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ExpandableNavbarSectionComponent as BaseComponent } from '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component';
import { slide } from '../../../../../app/shared/animations/slide';
import { MenuID } from '../../../../../app/shared/menu/menu-id.model';
import { rendersSectionForMenu } from '../../../../../app/shared/menu/menu-section.decorator';
import { HoverOutsideDirective } from '../../../../../app/shared/utils/hover-outside.directive';

@Component({
  selector: 'ds-themed-expandable-navbar-section',
  // templateUrl: './expandable-navbar-section.component.html',
  templateUrl: '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.html',
  // styleUrls: ['./expandable-navbar-section.component.scss'],
  styleUrls: ['../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.scss'],
  animations: [slide],
  imports: [
    AsyncPipe,
    HoverOutsideDirective,
    NgComponentOutlet,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
  ],
})
@rendersSectionForMenu(MenuID.PUBLIC, true, 'custom')
export class ExpandableNavbarSectionComponent extends BaseComponent {
}
