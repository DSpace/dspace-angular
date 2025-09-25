
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  NgForm,
} from '@angular/forms';
import {
  NavigationExtras,
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { isEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { getProcessListRoute } from '../process-page-routing.paths';
import { Process } from '../processes/process.model';
import { ProcessParameter } from '../processes/process-parameter.model';
import { Script } from '../scripts/script.model';
import { ScriptParameter } from '../scripts/script-parameter.model';
import { ProcessParametersComponent } from './process-parameters/process-parameters.component';
import { ScriptHelpComponent } from './script-help/script-help.component';
import { ScriptsSelectComponent } from './scripts-select/scripts-select.component';

/**
 * Component to create a new script
 */
@Component({
  selector: 'ds-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ProcessParametersComponent,
    RouterLink,
    ScriptHelpComponent,
    ScriptsSelectComponent,
    TranslateModule,
  ],
})
export class ProcessFormComponent implements OnInit {
  /**
   * The currently selected script
   */
  @Input() public selectedScript: Script = undefined;

  /**
   * The process to create
   */
  @Input() public process: Process = undefined;

  /**
   * The parameter values to use to start the process
   */
  @Input() public parameters: ProcessParameter[] = [];

  /**
   * Optional files that are used as parameter values
   */
  public files: File[] = [];

  /**
   * Message key for the header of the form
   */
  @Input() public headerKey: string;

  /**
   * Contains the missing parameters on submission
   */
  public missingParameters = [];

  constructor(
    private scriptService: ScriptDataService,
    private notificationsService: NotificationsService,
    private translationService: TranslateService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.process = new Process();
  }

  /**
   * Validates the form, sets the parameters to correct values and invokes the script with the correct parameters
   * @param form
   */
  submitForm(form: NgForm) {
    if (isEmpty(this.parameters)) {
      this.parameters = [];
    }
    if (!this.validateForm(form) || this.isRequiredMissing()) {
      return;
    }

    const stringParameters: ProcessParameter[] = this.parameters.map((parameter: ProcessParameter) => {
      return {
        name: parameter.name,
        value: this.checkValue(parameter),
      };
    },
    );
    this.scriptService.invoke(this.selectedScript.id, stringParameters, this.files)
      .pipe(getFirstCompletedRemoteData())
      .subscribe((rd: RemoteData<Process>) => {
        if (rd.hasSucceeded) {
          const title = this.translationService.get('process.new.notification.success.title');
          const content = this.translationService.get('process.new.notification.success.content');
          this.notificationsService.success(title, content);
          this.sendBack(rd.payload);
        } else {
          const title = this.translationService.get('process.new.notification.error.title');
          const content = this.translationService.get('process.new.notification.error.content');
          this.notificationsService.error(title, content);
        }
      });
  }

  /**
   * Checks whether the parameter values are files
   * Replaces file parameters by strings and stores the files in a separate list
   * @param processParameter The parameter value to check
   */
  private checkValue(processParameter: ProcessParameter): string {
    if (typeof processParameter.value === 'object') {
      this.files = [...this.files, processParameter.value];
      return processParameter.value.name;
    }
    return processParameter.value;
  }

  /**
   * Validates the form
   * Returns false if the form is invalid
   * Returns true if the form is valid
   * @param form The NgForm object to validate
   */
  private validateForm(form: NgForm) {
    let valid = true;
    Object.keys(form.controls).forEach((key) => {
      if (form.controls[key].invalid) {
        form.controls[key].markAsDirty();
        valid = false;
      }
    });
    return valid;
  }

  private isRequiredMissing() {
    this.missingParameters = [];
    const setParams: string[] = this.parameters
      .map((param) => param.name);
    const requiredParams: ScriptParameter[] = this.selectedScript.parameters.filter((param) => param.mandatory);
    for (const rp of requiredParams) {
      if (!setParams.includes(rp.name)) {
        this.missingParameters.push(rp.name);
      }
    }
    return this.missingParameters.length > 0;
  }

  /**
   * Redirect the user to the processes overview page with the new process' ID,
   * so it can be highlighted in the overview table.
   * @param newProcess The newly created process
   * @private
   */
  private sendBack(newProcess: Process) {
    const extras: NavigationExtras = {
      queryParams: { new_process_id: newProcess.processId },
    };
    void this.router.navigate([getProcessListRoute()], extras);
  }

  updateScript($event: Script) {
    this.selectedScript = $event;
    this.parameters = undefined;
  }

  get generatedProcessName() {
    const paramsString = this.parameters?.map((p: ProcessParameter) => {
      const value = this.parseValue(p.value);
      return isEmpty(value) ? p.name : `${p.name} ${value}`;
    }).join(' ') || '';
    return isEmpty(paramsString) ? this.selectedScript.name : `${this.selectedScript.name} ${paramsString}`;
  }

  private parseValue(value: any) {
    if (typeof value === 'boolean') {
      return undefined;
    }
    if (value instanceof File) {
      return value.name;
    }
    return value?.toString();
  }
}
