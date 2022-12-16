import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { PlacementDir } from './placement-dir.model';

// export type PlacementDir = 'left' | 'right';


@Component({
  selector: 'ds-context-help-wrapper',
  templateUrl: './context-help-wrapper.component.html',
  styleUrls: ['./context-help-wrapper.component.scss'],
})
export class ContextHelpWrapperComponent {
  @Input() templateRef: TemplateRef<any>;
  @Input() content: string;
  @Input() tooltipPlacement: PlacementArray;
  @Input() iconPlacement: PlacementDir;

  constructor() { }
}
