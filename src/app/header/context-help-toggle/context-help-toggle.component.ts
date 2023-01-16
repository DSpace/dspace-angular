import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextHelpService } from '../../shared/context-help.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ds-context-help-toggle',
  templateUrl: './context-help-toggle.component.html',
  styleUrls: ['./context-help-toggle.component.scss']
})
export class ContextHelpToggleComponent implements OnInit, OnDestroy {
  buttonDisabled$: Observable<boolean>;

  constructor(
    private contextHelpService: ContextHelpService,
    private translateService: TranslateService
  ) { }

  private clickEvents: BehaviorSubject<null> = new BehaviorSubject(null);
  private subs: Subscription[];

  ngOnInit(): void {
    this.buttonDisabled$ = this.contextHelpService.contextHelpEmpty$();
    this.subs = [
      this.buttonDisabled$.subscribe(),
      combineLatest([this.clickEvents, this.buttonDisabled$])
        .subscribe(([_, disabled]) =>
          disabled ? null : this.contextHelpService.toggleIcons())
    ];
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onClick() {
    this.clickEvents.next(null);
  }
}
