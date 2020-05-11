import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { BrowseByTypeConfig } from '../../../config/browse-by-type-config.interface';
import { map, tap } from 'rxjs/operators';
import { getComponentByBrowseByType } from './browse-by-decorator';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ds-browse-by-switcher',
  templateUrl: './browse-by-switcher.component.html'
})
/**
 * Component for determining what Browse-By component to use depending on the metadata (browse ID) provided
 */
export class BrowseBySwitcherComponent implements OnInit {

  /**
   * Resolved browse-by component
   */
  browseByComponent: Observable<any>;

  public constructor(protected route: ActivatedRoute) {
  }

  /**
   * Fetch the correct browse-by component by using the relevant config from environment.js
   */
  ngOnInit(): void {
    this.browseByComponent = this.route.params.pipe(
      map((params) => {
        const id = params.id;
        return environment.browseBy.types.find((config: BrowseByTypeConfig) => config.id === id);
      }),
      map((config: BrowseByTypeConfig) => getComponentByBrowseByType(config.type))
    );
  }

}
