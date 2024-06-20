import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNotEmpty } from '../../../../shared/empty.util';

/**
 * The component for defining the Clarin License Label
 */
@Component({
  selector: 'ds-define-license-label-form',
  templateUrl: './define-license-label-form.component.html',
  styleUrls: ['./define-license-label-form.component.scss']
})
export class DefineLicenseLabelFormComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder) { }

  /**
   * The `label` of the Clarin License Label. That's the shortcut which is max 5 characters long.
   */
  @Input()
  label = '';

  /**
   * The `title` of the Clarin License Label.
   */
  @Input()
  title = '';

  /**
   * The `extended` boolean of the Clarin License Label.
   */
  @Input()
  extended = '';

  /**
   * The `icon` of the Clarin License Label. This value is converted to the byte array.
   */
  @Input()
  icon = '';

  /**
   * The form with the Clarin License Label input fields
   */
  clarinLicenseLabelForm: FormGroup;

  /**
   * Is the Clarin License Label extended or no options.
   */
  extendedOptions = ['Yes', 'No'];

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Create form for changing license label data. The initial form values are passed from the selected license label
   * from the clarin-license-table.
   */
  private createForm() {
    this.clarinLicenseLabelForm = this.formBuilder.group({
      label: [this.label, [Validators.required, Validators.maxLength(5)]],
      title: [this.title, Validators.required],
      extended: isNotEmpty(this.extended) ? this.extended : this.extendedOptions[0],
      icon: [this.icon],
    });
  }

  /**
   * Send form value to the clarin-license-table component where it will be processed
   */
  submitForm() {
    this.activeModal.close(this.clarinLicenseLabelForm.value);
  }
}
