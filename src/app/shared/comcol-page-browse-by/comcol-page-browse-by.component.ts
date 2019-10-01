import { Component, Inject, Input, OnInit } from '@angular/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  styleUrls: ['./comcol-page-browse-by.component.scss'],
  templateUrl: './comcol-page-browse-by.component.html',
})
export class ComcolPageBrowseByComponent implements OnInit {
  /**
   * The ID of the Community or Collection
   */
  @Input() id: string;
  @Input() contentType: string;
  /**
   * List of currently active browse configurations
   */
  types: BrowseByTypeConfig[];

  constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig, private router: Router) {
  }

  ngOnInit(): void {
    this.types = this.config.browseBy.types;
  }
  onSelectChange(target) {
    const optionIndex = target.selectedIndex;
    const selectedOptionElement = target.options[optionIndex];
    const paramsAttribute = selectedOptionElement.getAttribute('data-params');
    console.log('change value ' + target.value + ' paramsAttribute ' + paramsAttribute);
    if (paramsAttribute) {
       /* console.log('Yes paramsAttribute ' + paramsAttribute);*/
      this.router.navigate([target.value], { queryParams: { scope: paramsAttribute } });
    } else {
      /*  console.log('No paramsAttribute ');*/
      this.router.navigate([target.value]);
    }
  }
}
