import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { AlertComponent } from '../shared/alert/alert.component';
import { AlertType } from '../shared/alert/alert-type';
import { HealthService } from './health.service';
import { HealthInfoComponent } from './health-info/health-info.component';
import { HealthPanelComponent } from './health-panel/health-panel.component';
import {
  HealthInfoResponse,
  HealthResponse,
} from './models/health-component.model';

@Component({
  selector: 'ds-health-page',
  templateUrl: './health-page.component.html',
  styleUrls: ['./health-page.component.scss'],
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    HealthInfoComponent,
    HealthPanelComponent,
    NgbNavModule,
    TranslateModule,
  ],
})
export class HealthPageComponent implements OnInit {

  /**
   * Health info endpoint response
   */
  healthInfoResponse: BehaviorSubject<HealthInfoResponse> = new BehaviorSubject<HealthInfoResponse>(null);

  /**
   * Health endpoint response
   */
  healthResponse: BehaviorSubject<HealthResponse> = new BehaviorSubject<HealthResponse>(null);

  /**
   * Represent if the response from health status endpoint is already retrieved or not
   */
  healthResponseInitialised: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Represent if the response from health info endpoint is already retrieved or not
   */
  healthInfoResponseInitialised: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  readonly AlertType = AlertType;

  constructor(private healthDataService: HealthService) {
  }

  /**
   * Retrieve responses from rest
   */
  ngOnInit(): void {
    this.healthDataService.getHealth().pipe(take(1)).subscribe({
      next: (data: any) => {
        this.healthResponse.next(data.payload);
        this.healthResponseInitialised.next(true);
      },
      error: () => {
        this.healthResponse.next(null);
        this.healthResponseInitialised.next(true);
      },
    });

    this.healthDataService.getInfo().pipe(take(1)).subscribe({
      next: (data: any) => {
        this.healthInfoResponse.next(data.payload);
        this.healthInfoResponseInitialised.next(true);
      },
      error: () => {
        this.healthInfoResponse.next(null);
        this.healthInfoResponseInitialised.next(true);
      },
    });

  }
}
