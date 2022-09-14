import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

/**
 * The component which contains the handle-table and the change-global-prefix section.
 */
@Component({
  selector: 'ds-handle-page',
  templateUrl: './handle-page.component.html',
  styleUrls: ['./handle-page.component.scss']
})
export class HandlePageComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   * Initialize the component
   */
  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
