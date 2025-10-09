import { of } from 'rxjs';

export class SidebarServiceStub {
  isCollapsed = of(true);

  collapse(): void {
    this.isCollapsed = of(true);
  }

  expand(): void {
    this.isCollapsed = of(false);
  }

}
