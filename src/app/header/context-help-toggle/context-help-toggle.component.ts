import { Component, OnInit } from '@angular/core';
import { ContextHelpService } from '../../shared/context-help.service';

@Component({
  selector: 'ds-context-help-toggle',
  templateUrl: './context-help-toggle.component.html',
  styleUrls: ['./context-help-toggle.component.scss']
})
export class ContextHelpToggleComponent implements OnInit {

  constructor(
    private contextHelpService: ContextHelpService
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    console.log('toggling icons');
    this.contextHelpService.toggleIcons();
  }
}
