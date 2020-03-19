import { Component } from '@angular/core';
import { Script } from '../scripts/script.model';

@Component({
  selector: 'ds-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss'],
})
export class NewProcessComponent {
  public selectedScript: Script;

  selectScript(script: Script) {
    this.selectedScript = script;
    console.log('selected script: ', script);
  }
}
