import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { slideMobileNav } from '../shared/animations/slide';
import { HostWindowService } from '../shared/host-window.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'ds-navbar',
  styleUrls: ['navbar.component.scss'],
  templateUrl: 'navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent {
  @Input() isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    public windowService: HostWindowService
  ) {
  }

  openDropdownOnHover(dropdown: any): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        dropdown.open();
      }
    });
  }

  closeDropdownOnHover(dropdown: any): void {
    this.windowService.isXsOrSm().pipe(
      first()
    ).subscribe((isMobile) => {
      if (!isMobile) {
        dropdown.close();
      }
    });
  }
}
