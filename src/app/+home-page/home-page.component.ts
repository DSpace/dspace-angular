import { Component, OnInit } from '@angular/core';
import { ClaimedTaskDataService } from '../core/tasks/claimed-task-data.service';
import { PlatformService } from '../shared/services/platform.service';
import { WorkflowitemDataService } from '../core/submission/workflowitem-data.service';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  constructor(private cs: WorkflowitemDataService, private ws: ClaimedTaskDataService, private ps: PlatformService) {}

  ngOnInit() {
    if (this.ps.isBrowser) {
      this.cs.searchBySubmitter({scopeID: '7d9f0b0d-280f-4e45-9526-04ed296d6460'})
        .subscribe((r) => {
          console.log(r);
        });
      this.ws.searchByUser({scopeID: '7d9f0b0d-280f-4e45-9526-04ed296d6460'})
        .subscribe((r) => {
          console.log(r);
        });
    }
  }
}
