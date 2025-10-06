import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ServerResponseService } from '@dspace/core/services/server-response.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component representing the `PageInternalServer` DSpace page.
 */
@Component({
  selector: 'ds-base-page-internal-server-error',
  styleUrls: ['./page-internal-server-error.component.scss'],
  templateUrl: './page-internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class PageInternalServerErrorComponent {

  /**
   * Initialize instance variables
   *
   * @param {ServerResponseService} responseService
   */
  constructor(private responseService: ServerResponseService) {
    this.responseService.setInternalServerError();
  }
}
