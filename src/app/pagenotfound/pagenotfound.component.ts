import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServerResponseService } from '../shared/services/server-response.service';

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
