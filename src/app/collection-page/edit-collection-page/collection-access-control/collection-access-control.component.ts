import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { Community } from '../../../core/shared/community.model';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';

@Component({
  selector: 'ds-collection-access-control',
  templateUrl: './collection-access-control.component.html',
  styleUrls: ['./collection-access-control.component.scss'],
})
export class CollectionAccessControlComponent  implements OnInit {
  itemRD$: Observable<RemoteData<Community>>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(
      map((data) => data.dso)
    ).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Community>>;
  }
}
