import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ServerResponseService } from '../core/services/server-response.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

/**
 * This component representing the `Forbidden` DSpace page.
 */
@Component({
    selector: 'ds-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.scss'],
    standalone: true,
    imports: [RouterLink, TranslateModule]
})
export class ForbiddenComponent implements OnInit {

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authService
   * @param {ServerResponseService} responseService
   */
  constructor(private authService: AuthService, private responseService: ServerResponseService) {
    this.responseService.setForbidden();
  }

  /**
   * Remove redirect url from the state
   */
  ngOnInit(): void {
    this.authService.clearRedirectUrl();
  }

}
