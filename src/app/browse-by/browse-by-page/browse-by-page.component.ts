import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';

@Component({
  selector: 'ds-browse-by-page',
  templateUrl: './browse-by-page.component.html',
  styleUrls: ['./browse-by-page.component.scss'],
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
