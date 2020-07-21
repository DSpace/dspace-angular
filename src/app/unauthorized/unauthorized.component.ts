import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ServerResponseService } from '../core/services/server-response.service';

/**
 * This component representing the `Unauthorized` DSpace page.
 */
@Component({
  selector: 'ds-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authservice
   * @param {ServerResponseService} responseService
   */
  constructor(private authservice: AuthService, private responseService: ServerResponseService) {
    this.responseService.setUnauthorized();
  }

  /**
   * Remove redirect url from the state
   */
  ngOnInit(): void {
    this.authservice.clearRedirectUrl();
  }

}
