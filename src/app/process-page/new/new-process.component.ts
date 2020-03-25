import { Component, OnInit } from '@angular/core';
import { Script } from '../scripts/script.model';
import { Process } from '../processes/process.model';
import { ProcessParameter } from '../processes/process-parameter.model';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { NgForm } from '@angular/forms';

/**
 * Component to create a new script
 */
@Component({
  selector: 'ds-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss'],
})
export class NewProcessComponent implements OnInit {
  /**
   * The currently selected script
   */
  public selectedScript: Script;

  /**
   * The process to create
   */
  public process: Process;

  /**
   * The parameter values to use to start the process
   */
  public parameters: ProcessParameter[];

  /**
   * Optional files that are used as parameter values
   */
  public files: File[] = [];

  constructor(private scriptService: ScriptDataService) {
  }

  ngOnInit(): void {
    this.process = new Process();
  }

  /**
   * Validates the form, sets the parameters to correct values and invokes the script with the correct parameters
   * @param form
   */
  submitForm(form: NgForm) {
    if (!this.validateForm(form)) {
      return;
    }

    const stringParameters: ProcessParameter[] = this.parameters.map((parameter: ProcessParameter) => {
        return {
          name: parameter.name,
          value: this.checkValue(parameter)
        };
      }
    );
    this.scriptService.invoke(this.selectedScript.id, stringParameters, this.files)
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
    if (form.invalid) {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsDirty();
      });
      return false;
    }
    return true;
  }
}
