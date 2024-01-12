import { Component, OnInit, ElementRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { AuthService } from '../../core/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { isAuthenticated } from '../../core/auth/selectors';

@Component({
  selector: 'ds-impersonate-navbar',
  templateUrl: 'impersonate-navbar.component.html'
})
/**
 * Navbar component for actions to take concerning impersonating users
 */
export class ImpersonateNavbarComponent implements OnInit {

  /**
   * Is the user currently impersonating another user?
   */
  isImpersonating$: Observable<boolean>;

  subscriptions: Subscription[] = [];

  constructor(
    protected elRef: ElementRef,
    protected store: Store<AppState>,
    protected authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.isImpersonating$ = this.store.pipe(select(isAuthenticated)).pipe(
      map((isUserAuthenticated: boolean) => isUserAuthenticated && this.authService.isImpersonating()),
    );
    this.subscriptions.push(this.isImpersonating$.subscribe((isImpersonating: boolean) => {
      if (isImpersonating) {
        this.elRef.nativeElement.classList.remove('d-none');
      } else {
        this.elRef.nativeElement.classList.add('d-none');
      }
    }));
  }

  /**
   * Stop impersonating the user
   */
  stopImpersonating() {
    this.authService.stopImpersonatingAndRefresh();
  }
}
