import { Component, Input } from '@angular/core';
import { Script } from '../../scripts/script.model';

@Component({
  selector: 'ds-script-help',
  templateUrl: './script-help.component.html',
  styleUrls: ['./script-help.component.scss']
})
export class ScriptHelpComponent {
  @Input() script: Script;
}
