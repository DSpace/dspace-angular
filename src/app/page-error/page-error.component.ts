import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component representing the `PageError` DSpace page.
 */
@Component({
    selector: 'ds-page-error',
    styleUrls: ['./page-error.component.scss'],
    templateUrl: './page-error.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [TranslateModule]
})
export class PageErrorComponent {
  status: number;
  code: string;
  /**
   * Initialize instance variables
   *
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.status = params.status;
      this.code = params.code;
    });
  }
}
