import { Component, OnInit, Input } from '@angular/core';
import { BrowseSection } from 'src/app/core/layout/models/section.model';

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
