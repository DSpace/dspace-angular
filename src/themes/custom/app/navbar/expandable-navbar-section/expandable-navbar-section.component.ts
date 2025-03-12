import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { ExpandableNavbarSectionComponent as BaseComponent } from '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component';
import { slide } from '../../../../../app/shared/animations/slide';
import { HoverOutsideDirective } from '../../../../../app/shared/utils/hover-outside.directive';

@Component({
  selector: 'ds-themed-expandable-navbar-section',
  // templateUrl: './expandable-navbar-section.component.html',
  templateUrl: '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.html',
  // styleUrls: ['./expandable-navbar-section.component.scss'],
  styleUrls: ['../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.scss'],
  animations: [slide],
  standalone: true,
  imports: [
    AsyncPipe,
    HoverOutsideDirective,
    NgComponentOutlet,
    RouterLinkActive,
  ],
})
export class ExpandableNavbarSectionComponent extends BaseComponent {
}
