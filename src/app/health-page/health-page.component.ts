import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { HealthService } from './health.service';
import { HealthInfoResponse, HealthResponse } from './models/health-component.model';

@Component({
  selector: 'ds-health-page',
  templateUrl: './health-page.component.html',
  styleUrls: ['./health-page.component.scss']
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

  constructor(private healthDataService: HealthService) {
  }

  /**
   * Retrieve responses from rest
   */
  ngOnInit(): void {
    this.healthDataService.getHealth().pipe(take(1)).subscribe({
      next: (data: any) => { this.healthResponse.next(data.payload); },
      error: () => { this.healthResponse.next(null); }
    });

    this.healthDataService.getInfo().pipe(take(1)).subscribe({
      next: (data: any) => { this.healthInfoResponse.next(data.payload); },
      error: () => { this.healthInfoResponse.next(null); }
    });

  }
}
