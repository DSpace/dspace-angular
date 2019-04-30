import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';
import { map, tap } from 'rxjs/operators';
import { getComponentByBrowseByType } from './browse-by-decorator';

@Component({
  selector: 'ds-browse-by-switcher',
  templateUrl: './browse-by-switcher.component.html'
})
/**
 * Component for determining what Browse-By component to use depending on the metadata (browse ID) provided
 */
export class BrowseBySwitcherComponent implements OnInit {

  /**
   * Resolved browse config
   */
  browseByTypeConfig: Observable<BrowseByTypeConfig>;

  public constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig,
                     protected route: ActivatedRoute) {
  }

  /**
   * Fetch the correct browse config from environment.js
   */
  ngOnInit(): void {
    this.browseByTypeConfig = this.route.params.pipe(
      map((params) => {
        const metadata = params.metadata;
        return this.config.browseBy.types.find((config: BrowseByTypeConfig) => config.metadata === metadata);
      })
    );
  }

  /**
   * Fetch the component depending on the browse type
   */
  getComponent() {
    return this.browseByTypeConfig.pipe(
      map((config: BrowseByTypeConfig) => getComponentByBrowseByType(config.type))
    );
  }

}
