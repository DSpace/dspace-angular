import { Component, Inject, Input, OnInit } from '@angular/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  templateUrl: './comcol-page-browse-by.component.html',
})
export class ComcolPageBrowseByComponent implements OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;

  /**
   * List of currently active browse configurations
   */
  types: BrowseByTypeConfig[];

  constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig) {
  }

  ngOnInit(): void {
    this.types = this.config.browseBy.types;
  }

}
