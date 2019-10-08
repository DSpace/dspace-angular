import { Component, Inject, Input, OnInit } from '@angular/core';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { getCollectionPageRoute } from '../../+collection-page/collection-page-routing.module';
import { getCommunityPageRoute } from '../../+community-page/community-page-routing.module';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';

export interface ComColPageNavOption {
  id: string;
  label: string,
  routerLink: string
  params?: any;
};
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

  allOptions: ComColPageNavOption[];

  constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig, private router: Router) {
  }

  ngOnInit(): void {
    this.allOptions = this.config.browseBy.types
    .map((config: BrowseByTypeConfig) => ({
      id: config.id,
      label: `browse.comcol.by.${config.id}`,
      routerLink: `/browse/${config.id}`,
      params: { scope: this.id }
    }));

    if (this.contentType === 'collection') {
      this.allOptions = [ {
        id: this.id,
        label: 'collection.page.browse.recent.head',
        routerLink: getCollectionPageRoute(this.id)
      }, ...this.allOptions ];
    } else if (this.contentType === 'community') {
      this.allOptions = [{
          id: this.id,
          label: 'community.all-lists.head',
          routerLink: getCommunityPageRoute(this.id)
        }, ...this.allOptions ];
    }

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
