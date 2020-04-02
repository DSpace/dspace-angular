import { Component, OnInit } from '@angular/core';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';

@Component({
  selector: 'ds-workflow-item-delete',
  templateUrl: './workflow-item-delete.component.html',
  styleUrls: ['./workflow-item-delete.component.scss']
})
export class WorkflowItemDeleteComponent implements OnInit {
  wfi: WorkflowItem;
  constructor() { }

  ngOnInit() {
  }

}
