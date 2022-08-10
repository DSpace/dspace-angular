import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

/**
 * Shows a loading animation when rendered on the server
 */
@Component({
  selector: 'ds-loading-csr',
  templateUrl: './loading-csr.component.html',
  styleUrls: ['./loading-csr.component.scss']
})
export class LoadingCsrComponent {
  loading: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.loading = isPlatformServer(this.platformId);
  }
}
