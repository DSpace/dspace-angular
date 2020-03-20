import { Component, OnInit } from '@angular/core';
import { Script } from '../scripts/script.model';
import { Process } from '../processes/process.model';

@Component({
  selector: 'ds-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss'],
})
export class NewProcessComponent implements OnInit {
  public selectedScript: Script;
  public process: Process;

  ngOnInit(): void {
    this.process = new Process();
  }

  selectScript(script: Script) {
    this.selectedScript = script;
    console.log('selected script: ', script);
  }
}
