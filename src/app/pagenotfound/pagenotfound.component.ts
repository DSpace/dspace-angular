import { ServerResponseService } from '../shared/services/server-response.service';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'ds-pagenotfound',
  styleUrls: ['./pagenotfound.component.scss'],
  templateUrl: './pagenotfound.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PageNotFoundComponent implements OnInit {
  constructor(private authservice: AuthService, private responseService: ServerResponseService) {
    this.responseService.setNotFound();
  }

  ngOnInit(): void {
    this.authservice.clearRedirectUrl();
  }

}
