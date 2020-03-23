import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../processes/process.model';
import { map } from 'rxjs/operators';
import { redirectToPageNotFoundOn404 } from '../../core/shared/operators';
import { AlertType } from '../../shared/alert/aletr-type';

@Component({
  selector: 'ds-process-detail',
  templateUrl: './process-detail.component.html',
})
/**
 * A component displaying detailed information about a DSpace Process
 */
export class ProcessDetailComponent implements OnInit {

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * The Process's Remote Data
   */
  processRD$: Observable<RemoteData<Process>>;

  constructor(protected route: ActivatedRoute,
              protected router: Router) {
  }

  /**
   * Initialize component properties
   * Display a 404 if the process doesn't exist
   */
  ngOnInit(): void {
    this.processRD$ = this.route.data.pipe(
      map((data) => data.process as RemoteData<Process>),
      redirectToPageNotFoundOn404(this.router)
    );
  }

}
