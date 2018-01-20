import { Component } from '@angular/core';
import { WorkspaceitemDataService } from '../core/data/workspaceitem-data.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: [ './home-page.component.scss' ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  constructor(protected workspaceitemDataService: WorkspaceitemDataService) {}

  ngOnInit() {
    this.workspaceitemDataService.findAll()
      .subscribe((result) => console.log(result));
  }
}
