import { ChangeDetectorRef, Component } from '@angular/core';

/**
 * The component which contains the handle-table and the change-global-prefix section.
 */
@Component({
  selector: 'ds-handle-page',
  templateUrl: './handle-page.component.html',
  styleUrls: ['./handle-page.component.scss']
})
export class HandlePageComponent {

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
