import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { Community } from '../../../core/shared/community.model';

@Component({
  selector: 'ds-community-access-control',
  templateUrl: './community-access-control.component.html',
  styleUrls: ['./community-access-control.component.scss'],
})
export class CommunityAccessControlComponent implements OnInit {
  itemRD$: Observable<RemoteData<Community>>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(
      map((data) => data.dso)
    ).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Community>>;
  }
}
