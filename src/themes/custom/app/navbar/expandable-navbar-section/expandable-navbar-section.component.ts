import { Component } from '@angular/core';

import { ExpandableNavbarSectionComponent as BaseComponent } from '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component';
import { slide } from '../../../../../app/shared/animations/slide';

/**
 * Represents an expandable section in the navbar
 */
@Component({
  selector: 'ds-expandable-navbar-section',
  // templateUrl: './expandable-navbar-section.component.html',
  templateUrl: '../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.html',
  // styleUrls: ['./expandable-navbar-section.component.scss'],
  styleUrls: ['../../../../../app/navbar/expandable-navbar-section/expandable-navbar-section.component.scss'],
  animations: [slide],
  standalone: true,
})
export class ExpandableNavbarSectionComponent extends BaseComponent {
}
