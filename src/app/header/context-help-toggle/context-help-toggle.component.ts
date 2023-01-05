import { Component, OnInit } from '@angular/core';
import { ContextHelpService } from '../../shared/context-help.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-context-help-toggle',
  templateUrl: './context-help-toggle.component.html',
  styleUrls: ['./context-help-toggle.component.scss']
})
export class ContextHelpToggleComponent implements OnInit {

  constructor(
    private contextHelpService: ContextHelpService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.contextHelpService.toggleIcons();
  }
}
