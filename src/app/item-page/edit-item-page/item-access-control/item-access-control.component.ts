import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ds-item-access-control',
  templateUrl: './item-access-control.component.html',
  styleUrls: [ './item-access-control.component.scss' ],
})
export class ItemAccessControlComponent implements OnInit {

  itemRD$: Observable<RemoteData<Item>>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(
      map((data) => data.dso)
    ).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Item>>;
  }

}
