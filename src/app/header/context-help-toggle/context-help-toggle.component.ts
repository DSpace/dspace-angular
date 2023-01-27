import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextHelpService } from '../../shared/context-help.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Renders a "context help toggle" button that toggles the visibility of tooltip buttons on the page.
 * If there are no tooltip buttons available on the current page, the toggle is unclickable.
 */
@Component({
  selector: 'ds-context-help-toggle',
  templateUrl: './context-help-toggle.component.html',
  styleUrls: ['./context-help-toggle.component.scss']
})
export class ContextHelpToggleComponent implements OnInit, OnDestroy {
  buttonVisible$: Observable<boolean>;

  constructor(
    private contextHelpService: ContextHelpService,
  ) { }

  private subs: Subscription[];

  ngOnInit(): void {
    this.buttonVisible$ = this.contextHelpService.tooltipCount$().pipe(map(x => x > 0));
    this.subs = [this.buttonVisible$.subscribe()];
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onClick() {
    this.contextHelpService.toggleIcons();
  }
}
