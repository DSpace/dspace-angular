import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClarinLicenseLabel } from '../../../../core/shared/clarin/clarin-license-label.model';
import {
  CLARIN_LICENSE_CONFIRMATION, CLARIN_LICENSE_FORM_REQUIRED_OPTIONS
} from '../../../../core/shared/clarin/clarin-license.resource-type';
import { ClarinLicenseLabelDataService } from '../../../../core/data/clarin/clarin-license-label-data.service';
import { getFirstSucceededRemoteListPayload } from '../../../../core/shared/operators';
import { validateLicenseLabel } from './define-license-form-validator';
import { isNull, isUndefined } from '../../../../shared/empty.util';

/**
 * The component for defining and editing the Clarin License
 */
@Component({
  selector: 'ds-define-license-form',
  templateUrl: './define-license-form.component.html',
  styleUrls: ['./define-license-form.component.scss']
})
export class DefineLicenseFormComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private clarinLicenseLabelService: ClarinLicenseLabelDataService
  ) {
  }

  /**
   * The `name` of the Clarin License
   */
  @Input()
  name = '';

  /**
   * The `definition` of the Clarin License
   */
  @Input()
  definition = '';

  /**
   * The `confirmation` of the Clarin License. This value is converted to the number in the appropriate Serializer
   */
  @Input()
  confirmation = '';

  /**
   * Selected extended license labels
   */
  @Input()
  extendedClarinLicenseLabels = [];

  /**
   * Selected non extended clarin license label - could be selected only one clarin license label
   */
  @Input()
  clarinLicenseLabel: ClarinLicenseLabel = null;

  /**
   * Selected required info
   */
  @Input()
  requiredInfo = [];

  /**
   * The form with the Clarin License input fields
   */
  clarinLicenseForm: FormGroup = null;

  /**
   * The possible options for the `confirmation` input field
   */
  confirmationOptions: any[] = CLARIN_LICENSE_CONFIRMATION;

  /**
   * All non extended Clarin License Labels, admin could select only one Clarin License Label
   */
  clarinLicenseLabelOptions: ClarinLicenseLabel[] = [];

  /**
   * All extended Clarin License Labels, admin could select multiple Clarin License Labels
   */
  extendedClarinLicenseLabelOptions: ClarinLicenseLabel[] = [];

  /**
   * All user required info
   */
  requiredInfoOptions = CLARIN_LICENSE_FORM_REQUIRED_OPTIONS;

  ngOnInit(): void {
    this.createForm();
    // load clarin license labels
    this.loadAndAssignClarinLicenseLabels();
  }

  /**
   * After init load loadArrayValuesToForm
   */
  ngAfterViewInit(): void {
    // wait because the form is not loaded immediately after init - do not know why
    setTimeout(() => {
      this.loadArrayValuesToForm();
    },
    500);
  }

  /**
   * Create the clarin license input fields form with init values which are passed from the clarin-license-table
   * @private
   */
  private createForm() {
    this.clarinLicenseForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      definition: [this.definition, Validators.required],
      confirmation: this.confirmation,
      clarinLicenseLabel: [this.clarinLicenseLabel, validateLicenseLabel()],
      extendedClarinLicenseLabels: new FormArray([]),
      requiredInfo: new FormArray([]),
    });
  }

  /**
   * Show the selected extended clarin license labels and the required info in the form.
   * if the admin is editing the clarin license he must see which extended clarin license labels/required info
   * are selected.
   * @private
   */
  private loadArrayValuesToForm() {
    // add passed extendedClarinLicenseLabels to the form because add them to the form in the init is a problem
    const extendedClarinLicenseLabels = (this.clarinLicenseForm.controls.extendedClarinLicenseLabels).value as any[];
    this.extendedClarinLicenseLabels.forEach(extendedClarinLicenseLabel => {
      extendedClarinLicenseLabels.push(extendedClarinLicenseLabel);
    });

    // add passed requiredInfo to the form because add them to the form in the init is a problem
    const requiredInfoOptions = (this.clarinLicenseForm.controls.requiredInfo).value as any[];
    this.requiredInfo.forEach(requiredInfo => {
      requiredInfoOptions.push(requiredInfo);
    });
  }

  /**
   * Send form value to the clarin-license-table component where it will be processed
   */
  submitForm() {
    this.activeModal.close(this.clarinLicenseForm.value);
  }

  /**
   * Add or remove checkbox value from form array based on the checkbox selection
   * @param event
   * @param formName
   * @param extendedClarinLicenseLabel
   */
  changeCheckboxValue(event: any, formName: string, checkBoxValue) {
    let form = null;

    Object.keys(this.clarinLicenseForm.controls).forEach( (key, index) => {
      if (key === formName) {
        form = (this.clarinLicenseForm.controls[key])?.value as any[];
      }
    });

    if (isUndefined(form) || isNull(form)) {
      return;
    }

    if (event.target.checked) {
      form.push(checkBoxValue);
    } else {
      form.forEach((formValue, index)  => {
        if (formValue?.id === checkBoxValue.id) {
          form.splice(index, 1);
        }
      });
    }
  }

  /**
   * Load all ClarinLicenseLabels and divide them based on the extended property.
   * @private
   */
  private loadAndAssignClarinLicenseLabels() {
    this.clarinLicenseLabelService.findAll({ elementsPerPage: 100 }, false)
      .pipe(getFirstSucceededRemoteListPayload())
      .subscribe(res => {
        res.forEach(clarinLicenseLabel => {
          if (clarinLicenseLabel.extended) {
            this.extendedClarinLicenseLabelOptions.push(clarinLicenseLabel);
          } else {
            this.clarinLicenseLabelOptions.push(clarinLicenseLabel);
          }
        });
      });
  }
}
