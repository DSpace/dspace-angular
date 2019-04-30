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
export class BrowseBySwitcherComponent implements OnInit {

  browseByTypeConfig: Observable<BrowseByTypeConfig>;

  public constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig,
                     protected route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.browseByTypeConfig = this.route.params.pipe(
      map((params) => {
        const metadata = params.metadata;
        return this.config.browseBy.types.find((config: BrowseByTypeConfig) => config.metadata === metadata);
      })
    );
  }

  getComponent() {
    return this.browseByTypeConfig.pipe(
      map((config: BrowseByTypeConfig) => getComponentByBrowseByType(config.type))
    );
  }

}
