import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../../submission.reducers';
import { BitstreamService } from '../../bitstream/bitstream.service';
import { hasValue } from '../../../../shared/empty.util';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { BITSTREAM_FORM_MODEL } from './files-edit.model';
import { FormComponent } from '../../../../shared/form/form.component';
import {FormService} from "../../../../shared/form/form.service";

@Component({
  selector: 'ds-submission-submit-form-box-files-edit',
  templateUrl: './files-edit.component.html',
})
export class FilesEditComponent {

  @ViewChild('formRef') formRef: FormComponent;

  @Input() bitstreamId;
  @Input() submissionId;
  public bitstream;
  public formId;
  public readMode = true;
  public formModel: DynamicFormControlModel[];

  protected subscriptions = [];

  constructor(private modalService: NgbModal,
              private bitstreamService: BitstreamService,
              private formService: FormService,
              protected submissionState: Store<SubmissionState>) {
    this.formModel = BITSTREAM_FORM_MODEL;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.bitstreamService
        .getBitstream(this.submissionId, this.bitstreamId)
        .subscribe((bitstream) => {
                                          this.bitstream = bitstream;
                                        }
        )
    );
    this.formId = 'form_' + this.bitstreamId;
  }

  ngAfterViewInit() {
    // The 'ViewChild' map the variable only after the view init. And be sure to do not put the
    // ref inside an *ngIf or the output will be null until that part of HTML will be rendered.
    // this.formRef.formGroup.controls['files-data'].controls['title'].setValue(this.bitstream.title);
    // this.formRef.formGroup.controls['files-data'].controls['description'].setValue(this.bitstream.description);
  }

  public switchMode(mode:boolean) {
    this.readMode = mode;
  }

  public deleteBitstream() {
    this.bitstreamService.deleteBitstream(this.submissionId, this.bitstreamId);
  }

  public editBitstream() {
    this.switchMode(true);
    this.formService.isValid(this.formRef.formUniqueId).map(
      (isValid) => {
        if (isValid) {
          this.formService.getFormData(this.formRef.formUniqueId).map(
            (metadata) => {
              console.log(metadata);
              /*const data = Object.assign(
                {},
                this.bitstream,
                {
                  title: metadata.title,
                  description: metadata.description
                }
              );
              this.bitstreamService.editBitstream(this.submissionId, this.bitstreamId, data);*/
            }
          );
        } else {
          this.formService.validateAllFormFields(this.formRef.formRef.control);
        }
      }
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
