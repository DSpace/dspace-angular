import { Component, Input } from '@angular/core';
import { BrowseSection } from '../../../core/layout/models/section.model';

/**
 * Component representing the Browse component section.
 */
@Component({
  selector: 'ds-browse-section',
  templateUrl: './browse-section.component.html'
})
export class BrowseSectionComponent {

  @Input()
  sectionId: string;

  @Input()
  browseSection: BrowseSection;

}
