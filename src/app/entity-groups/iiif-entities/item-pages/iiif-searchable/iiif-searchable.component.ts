import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Component, OnInit } from '@angular/core';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { RouteService } from '../../../../core/services/route.service';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, take } from 'rxjs/operators';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

@listableObjectComponent('IIIFSearchable', ViewMode.StandalonePage)
@Component({
  selector: 'ds-iiif-searchable',
  styleUrls: ['./iiif-searchable.component.scss'],
  templateUrl: './iiif-searchable.component.html'
})

export class IIIFSearchableComponent extends ItemComponent implements OnInit {

  searchable: boolean;

  query: Observable<string>;

  constructor(protected routeService: RouteService,
              protected bitstreamService: BitstreamDataService) {
    super(bitstreamService);
  }

  ngOnInit(): void {
    // Load iiif viewer in searchable configuration.
    this.searchable = true;
    // Use the route history to get the query from a
    // previous search and use this value to initialize the
    // viewer with search results.
    // TODO: is there is a better way to look the previous search
    this.query =  this.routeService.getHistory().pipe(
      take(1),
      map(routes => routes[routes.length - 2 ]),
      filter(r => {
        return r.includes('/search');
      }),
      map(r => {
        const arr = r.split('&');
        const q = arr[1];
        const v = q.split('=');
        return v[1];
      })
    );
  }

}
