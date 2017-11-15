import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BitstreamService } from '../../bitstream/bitstream.service';
import { hasValue } from '../../../../shared/empty.util';
import {
  DynamicFormControlModel, DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import {BITSTREAM_FORM_MODEL, BITSTREAM_FORM_POLICIES_GROUP} from './files-edit.model';
import { FormComponent } from '../../../../shared/form/form.component';
import { FormService } from '../../../../shared/form/form.service';

@Component({
  selector: 'ds-submission-submit-form-box-files-edit',
  templateUrl: './files-edit.component.html',
})
export class FilesEditComponent {

  // The 'ViewChild' maps the variable only after the view init. And be sure to do not put the
  // ref inside an *ngIf or the output will be null until that part of HTML will be rendered.
  @ViewChild('formRef') formRef: FormComponent;

  @Input() bitstreamId;
  @Input() sectionId;
  @Input() submissionId;
  public bitstream;
  public formId;
  public readMode = true;
  public initialized = false;
  public formModel: DynamicFormControlModel[];
  public formPoliciesGroup: DynamicFormGroupModel;

  protected subscriptions = [];

  constructor(private modalService: NgbModal,
              private bitstreamService: BitstreamService,
              private formService: FormService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.bitstreamService
        .getBitstream(this.submissionId, this.sectionId, this.bitstreamId)
        .take(1)
        .subscribe((bitstream) => {
                                          this.bitstream = bitstream;
                                          this.formModel = BITSTREAM_FORM_MODEL;
                                          this.formPoliciesGroup = BITSTREAM_FORM_POLICIES_GROUP;
                                          this.formId = 'form_' + this.bitstreamId;
                                          this.setFormPoliciesModel();
                                        }
        )
    );
  }

  public setFormInitialMetadata() {
    if (!this.initialized) {
      this.initialized = true;
      // Alternative mode to assign:
      // this.formRef.formGroup.controls['files-data'].controls.title.setValue(...);
      // Cannot put the following lines into 'ngOnInit' because 'this.formRef' is available only after the view init.
      // Cannot put the following lines into 'ngAfterViewInit' because of 'ExpressionChangedAfterItHasBeenCheckedError'.
      this.formRef.formGroup.get('files-data').get('title').setValue(this.bitstream.title);
      this.formRef.formGroup.get('files-data').get('description').setValue(this.bitstream.description);
    }
  }

  public setFormPoliciesModel() {

  }

  public switchMode(mode:boolean) {
    this.setFormInitialMetadata();
    this.readMode = mode;
  }

  public deleteBitstream() {
    this.bitstreamService.deleteBitstream(this.submissionId, this.sectionId, this.bitstreamId);
  }

  public editBitstream() {
    this.switchMode(true);
    this.subscriptions.push(
      this.formService.isValid(this.formRef.formUniqueId)
        .take(1)
        .subscribe((isValid) => {
          if (isValid) {
            this.subscriptions.push(
              this.formService.getFormData(this.formRef.formUniqueId)
                .take(1)
                .subscribe((metadata) => {
                  console.log(metadata);
                  const data = Object.assign(
                    {},
                    this.bitstream,
                    {
                      title: metadata['files-data'].title,
                      description: metadata['files-data'].description
                    }
                  );
                  this.bitstreamService.editBitstream(this.submissionId, this.sectionId, this.bitstreamId, data);
                }
              )
            );
          } else {
            this.formService.validateAllFormFields(this.formRef.formRef.control);
          }
        }
      )
    );
  }

  public openModal(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.deleteBitstream();
        }
      }
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subscriptions
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
