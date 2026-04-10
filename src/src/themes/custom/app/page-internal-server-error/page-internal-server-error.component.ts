import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { PageInternalServerErrorComponent as BaseComponent } from '../../../../app/page-internal-server-error/page-internal-server-error.component';

@Component({
  selector: 'ds-themed-page-internal-server-error',
  styleUrls: ['./page-internal-server-error.component.scss'],
  templateUrl: './page-internal-server-error.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class PageInternalServerErrorComponent extends BaseComponent implements OnInit {

  private readonly titleService = inject(Title);
  private readonly translateService = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.translateService.get('500.page-internal-server-error')
        .pipe(take(1))
        .subscribe((t: string) => {
          this.titleService.setTitle(t);
        });
    }
  }
}
