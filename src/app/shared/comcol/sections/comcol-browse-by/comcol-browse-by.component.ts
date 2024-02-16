import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowseByDataType } from '../../../../browse-by/browse-by-switcher/browse-by-data-type';
import { ActivatedRoute, Data } from '@angular/router';
import { map } from 'rxjs/operators';
import { BrowseDefinition } from '../../../../core/shared/browse-definition.model';

@Component({
  selector: 'ds-comcol-browse-by',
  templateUrl: './comcol-browse-by.component.html',
  styleUrls: ['./comcol-browse-by.component.scss'],
})
export class ComcolBrowseByComponent implements OnInit {

  browseByType$: Observable<BrowseByDataType>;

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
      map((data: { browseDefinition: BrowseDefinition }) => data.browseDefinition.getRenderType()),
    );
    this.scope$ = this.route.data.pipe(
      map((data: Data) => data.scope),
    );
  }

}
