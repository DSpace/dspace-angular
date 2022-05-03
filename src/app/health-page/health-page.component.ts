import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { HealthDataService } from './health-data.service';
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

  constructor(private healthDataService: HealthDataService) {
  }

  /**
   * Retrieve responses from rest
   */
  ngOnInit(): void {
    this.healthDataService.getHealth().pipe(take(1)).subscribe((data: any) => {
      this.healthResponse.next(data.payload);
    });

    this.healthDataService.getInfo().pipe(take(1)).subscribe((data) => {
      this.healthInfoResponse.next(data.payload);
    });
  }
}
