import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '@dspace/core';
import { Community } from '@dspace/core';
import { getFirstSucceededRemoteData } from '@dspace/core';
import { AccessControlFormContainerComponent } from '../../../shared/access-control-form-container/access-control-form-container.component';

@Component({
  selector: 'ds-collection-access-control',
  templateUrl: './collection-access-control.component.html',
  styleUrls: ['./collection-access-control.component.scss'],
  imports: [
    AccessControlFormContainerComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class CollectionAccessControlComponent  implements OnInit {
  itemRD$: Observable<RemoteData<Community>>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(
      map((data) => data.dso),
    ).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Community>>;
  }
}
