import { ServerResponseService } from '../shared/server-response.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ds-pagenotfound',
  styleUrls: ['./pagenotfound.component.scss'],
  templateUrl: './pagenotfound.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PageNotFoundComponent {
  constructor(responseService: ServerResponseService) {
    responseService.setNotFound();
  }
}
