import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';

export type PlacementDir = 'left' | 'right';

@Component({
  selector: 'ds-context-help-wrapper',
  templateUrl: './context-help-wrapper.component.html',
  styleUrls: ['./context-help-wrapper.component.scss']
})
export class ContextHelpWrapperComponent implements OnInit {
  @Input() templateRef: TemplateRef<any>;
  @Input() content: string;
  @Input() tooltipPlacement: PlacementArray; // TODO: type
  // @Input('iconPlacement') iconPlacement: string;

  constructor() { }

  ngOnInit(): void {
    // console.log("In ContextHelpWrapperComponent.ngOnInit:", this.content); // XXX
  }

}
