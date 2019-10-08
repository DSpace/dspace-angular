import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input, NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { getCollectionPageRoute } from '../../+collection-page/collection-page-routing.module';
import { getCommunityPageRoute } from '../../+community-page/community-page-routing.module';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { Router, ActivatedRoute, RouterModule, UrlSegment } from '@angular/router';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';
import { hasValue } from '../empty.util';

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
  templateUrl: './comcol-page-browse-by.component.html'
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

  currentOptionId$: Observable<string>;

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    private route: ActivatedRoute,
    private router: Router) {
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

    this.currentOptionId$ = this.route.url.pipe(
      filter((urlSegments: UrlSegment[]) => hasValue(urlSegments)),
      map((urlSegments: UrlSegment[]) => urlSegments[urlSegments.length - 1].path)
    );
  }

  onSelectChange(newId: string) {
    const selectedOption = this.allOptions
      .find((option: ComColPageNavOption) => option.id === newId);

    this.router.navigate([selectedOption.routerLink], { queryParams: selectedOption.params });
  }
}
