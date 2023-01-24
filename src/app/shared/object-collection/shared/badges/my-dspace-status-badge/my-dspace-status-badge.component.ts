import { Component, Input, OnInit } from '@angular/core';
import { Context } from 'src/app/core/shared/context.model';

/**
 * This component represents a badge with mydspace item status
 */
@Component({
  selector: 'ds-my-dspace-status-badge',
  styleUrls: ['./my-dspace-status-badge.component.scss'],
  templateUrl: './my-dspace-status-badge.component.html'
})
export class MyDSpaceStatusBadgeComponent implements OnInit {

  /**
   * This mydspace item context
   */
  @Input() context: Context;

  /**
   * This badge class
   */
  public badgeClass: string;

  /**
   * This badge content
   */
  public badgeContent: string;

  /**
   * Initialize badge content and class
   */
  ngOnInit() {
    this.badgeContent = this.context;
    this.badgeClass = 'text-light badge ';
    switch (this.context) {
      case Context.MyDSpaceValidation:
        this.badgeClass += 'badge-warning';
        break;
      case Context.MyDSpaceWaitingController:
        this.badgeClass += 'badge-info';
        break;
      case Context.MyDSpaceWorkspace:
        this.badgeClass += 'badge-primary';
        break;
      case Context.MyDSpaceArchived:
        this.badgeClass += 'badge-success';
        break;
      case Context.MyDSpaceWorkflow:
        this.badgeClass += 'badge-info';
        break;
    }
  }

}
