import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicRelationGroupModel } from '../relation-group/dynamic-relation-group.model';
import { isNotEmpty } from '../../../../../empty.util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DsDynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';

@Component({
  selector: 'ds-dynamic-lookup-relation',
  // styleUrls: ['./dynamic-lookup-relation.component.scss'],
  templateUrl: './dynamic-lookup-relation.component.html'
})
export class DsDynamicLookupRelationComponent extends DynamicFormControlComponent implements OnInit {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicRelationGroupModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  modalRef: NgbModalRef;

  constructor(private modalService: NgbModal,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
  }

  public hasEmptyValue() {
    return isNotEmpty(this.model.value);
  }

  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent);
    this.modalRef.componentInstance.relationKey = this.model.name;
    this.modalRef.result.then((result) => {
      this.model.value = result;
    });
  }

  alert(t: string) {
    alert(t);
  }
}
