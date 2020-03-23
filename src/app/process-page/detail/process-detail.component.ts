import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../processes/process.model';
import { map } from 'rxjs/operators';
import { redirectToPageNotFoundOn404 } from '../../core/shared/operators';

@Component({
  selector: 'ds-process-detail',
  templateUrl: './process-detail.component.html',
})
export class ProcessDetailComponent implements OnInit {

  processRD$: Observable<RemoteData<Process>>;

  constructor(protected route: ActivatedRoute,
              protected router: Router) {
  }

  ngOnInit(): void {
    this.processRD$ = this.route.data.pipe(
      map((data) => data.process as RemoteData<Process>),
      redirectToPageNotFoundOn404(this.router)
    );
  }

}
