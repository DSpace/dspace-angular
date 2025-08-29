import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstSucceededRemoteData } from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccessControlFormContainerComponent } from '../../../shared/access-control-form-container/access-control-form-container.component';

@Component({
  selector: 'ds-item-access-control',
  templateUrl: './item-access-control.component.html',
  styleUrls: ['./item-access-control.component.scss'],
  imports: [
    AccessControlFormContainerComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class ItemAccessControlComponent implements OnInit {

  itemRD$: Observable<RemoteData<Item>>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(
      map((data) => data.dso),
    ).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Item>>;
  }

}
