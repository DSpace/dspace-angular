import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
} from '@angular/router';
import {
  BrowseByDataType,
  BrowseDefinition,
} from '@dspace/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrowseBySwitcherComponent } from '../../../../browse-by/browse-by-switcher/browse-by-switcher.component';

@Component({
  selector: 'ds-comcol-browse-by',
  templateUrl: './comcol-browse-by.component.html',
  styleUrls: ['./comcol-browse-by.component.scss'],
  imports: [
    BrowseBySwitcherComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class ComcolBrowseByComponent implements OnInit {

  browseByType$: Observable<{type: BrowseByDataType }>;

  scope$: Observable<string>;

  constructor(
    protected route: ActivatedRoute,
  ) {
  }

  /**
   * Fetch the correct browse-by component by using the relevant config from the route data
   */
  ngOnInit(): void {
    this.browseByType$ = this.route.data.pipe(
      map((data: { browseDefinition: BrowseDefinition }) => ({ type: data.browseDefinition.getRenderType() })),
    );
    this.scope$ = this.route.data.pipe(
      map((data: Data) => data.scope),
    );
  }

}
