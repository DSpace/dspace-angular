import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { ContextHelpService } from '../../shared/context-help.service';

/**
 * Renders a "context help toggle" button that toggles the visibility of tooltip buttons on the page.
 * If there are no tooltip buttons available on the current page, the toggle is unclickable.
 */
@Component({
  selector: 'ds-context-help-toggle',
  templateUrl: './context-help-toggle.component.html',
  styleUrls: ['./context-help-toggle.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
})
export class ContextHelpToggleComponent implements OnInit {
  buttonVisible$: Observable<boolean>;

  subscriptions: Subscription[] = [];

  constructor(
    protected elRef: ElementRef,
    protected contextHelpService: ContextHelpService,
  ) {
  }

  ngOnInit(): void {
    this.buttonVisible$ = this.contextHelpService.tooltipCount$().pipe(map(x => x > 0));
    this.subscriptions.push(this.buttonVisible$.subscribe((showContextHelpToggle: boolean) => {
      if (showContextHelpToggle) {
        this.elRef.nativeElement.classList.remove('d-none');
      } else {
        this.elRef.nativeElement.classList.add('d-none');
      }
    }));
  }

  onClick() {
    this.contextHelpService.toggleIcons();
  }
}
