import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { Script } from '@dspace/core/shared/scripts/script.model';
import { ScriptParameterType } from '@dspace/core/shared/scripts/script-parameter-type.model';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Components that represents a help section for the script use and parameters
 */
@Component({
  selector: 'ds-script-help',
  templateUrl: './script-help.component.html',
  styleUrls: ['./script-help.component.scss'],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    TranslateModule,
  ],
})
export class ScriptHelpComponent {
  /**
   * The current script to show the help information for
   */
  @Input() script: Script;

  /**
   * The available script parameter types
   */
  parameterTypes = ScriptParameterType;
}
