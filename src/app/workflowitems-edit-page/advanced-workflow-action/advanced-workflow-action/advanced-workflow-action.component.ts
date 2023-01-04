import { Component, OnInit } from '@angular/core';
import { WorkflowAction } from '../../../core/tasks/models/workflow-action-object.model';
import { WorkflowActionDataService } from '../../../core/data/workflow-action-data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';

@Component({
  selector: 'ds-advanced-workflow-action',
  templateUrl: './advanced-workflow-action.component.html',
  styleUrls: ['./advanced-workflow-action.component.scss']
})
export class AdvancedWorkflowActionComponent implements OnInit {

  workflowAction: Observable<WorkflowAction>;

  constructor(
    protected route: ActivatedRoute,
    protected workflowActionService: WorkflowActionDataService,
  ) {
  }

  ngOnInit(): void {
    this.workflowAction = this.workflowActionService.findById(this.route.snapshot.queryParams.workflow).pipe(
      getFirstSucceededRemoteDataPayload(),
    );
  }

}
