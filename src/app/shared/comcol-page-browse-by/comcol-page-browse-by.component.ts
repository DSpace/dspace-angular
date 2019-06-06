import { Component, Input } from '@angular/core';

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  templateUrl: './comcol-page-browse-by.component.html',
})
export class ComcolPageBrowseByComponent {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
}
