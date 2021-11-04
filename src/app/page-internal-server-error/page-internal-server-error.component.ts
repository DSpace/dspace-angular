import { ServerResponseService } from '../core/services/server-response.service';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';

/**
 * This component representing the `PageNotFound` DSpace page.
 */
@Component({
  selector: 'ds-page-internal-server-error',
  styleUrls: ['./page-internal-server-error.component.scss'],
  templateUrl: './page-internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PageInternalServerErrorComponent implements OnInit {

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authservice
   * @param {ServerResponseService} responseService
   */
  constructor(private authservice: AuthService, private responseService: ServerResponseService) {
    this.responseService.setNotFound();
  }

  /**
   * Remove redirect url from the state
   */
  ngOnInit(): void {
    this.authservice.clearRedirectUrl();
  }

}
