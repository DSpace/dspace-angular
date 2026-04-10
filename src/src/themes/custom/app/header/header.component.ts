import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { ThemedAuthNavMenuComponent } from '../../../../app/shared/auth-nav-menu/themed-auth-nav-menu.component';
import { ThemedLangSwitchComponent } from '../../../../app/shared/lang-switch/themed-lang-switch.component';
import { MenuService } from '../../../../app/shared/menu/menu.service';

@Component({
  selector: 'ds-themed-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  imports: [
    NgbDropdownModule,
    RouterLink,
    ThemedAuthNavMenuComponent,
    ThemedLangSwitchComponent,
    TranslateModule,
  ],
})
export class HeaderComponent extends BaseComponent implements OnInit, OnDestroy {
  menuOpen = false;
  private routerSub: Subscription;

  constructor(
    protected menuService: MenuService,
    protected windowService: HostWindowService,
    private router: Router,
  ) {
    super(menuService, windowService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.menuOpen = false;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
