import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ItemRequest } from '../../core/shared/item-request.model';
import { Observable } from 'rxjs/internal/Observable';
import {
  getFirstCompletedRemoteData,
  redirectOn4xx
} from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-deny-request-copy',
  styleUrls: ['./deny-request-copy.component.scss'],
  templateUrl: './deny-request-copy.component.html'
})
export class DenyRequestCopyComponent implements OnInit {
  itemRequestRD$: Observable<RemoteData<ItemRequest>>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.itemRequestRD$ = this.route.data.pipe(
      map((data) => data.request as RemoteData<ItemRequest>),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
    );
  }

}
