import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';
import { BrowseBySwitcherComponent } from '../browse-by-switcher/browse-by-switcher.component';

@Component({
  selector: 'ds-browse-by-page',
  templateUrl: './browse-by-page.component.html',
  styleUrls: ['./browse-by-page.component.scss'],
  imports: [
    BrowseBySwitcherComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class BrowseByPageComponent implements OnInit {

  browseByType$: Observable<BrowseByDataType>;

  constructor(
    protected route: ActivatedRoute,
  ) {
  }

  /**
   * Fetch the correct browse-by component by using the relevant config from the route data
   */
  ngOnInit(): void {
    this.browseByType$ = this.route.data.pipe(
      map((data: { browseDefinition: BrowseDefinition }) => data.browseDefinition.getRenderType()),
    );
  }

}
