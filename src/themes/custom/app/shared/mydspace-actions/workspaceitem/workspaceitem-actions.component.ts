import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { WorkspaceitemActionsComponent as BaseComponent } from '../../../../../../app/shared/mydspace-actions/workspaceitem/workspaceitem-actions.component';


@Component({
  selector: 'ds-themed-workspaceitem-actions',
  styleUrls: ['./workspaceitem-actions.component.scss'],
  templateUrl: '../../../../../../app/shared/mydspace-actions/workspaceitem/workspaceitem-actions.component.html',
  standalone: true,
  imports: [NgbTooltipModule, RouterLink, NgIf, AsyncPipe, TranslateModule],
  //templateUrl : './workspaceitem-actions.component.html'
})
export class WorkspaceitemActionsComponent extends BaseComponent  {

}
