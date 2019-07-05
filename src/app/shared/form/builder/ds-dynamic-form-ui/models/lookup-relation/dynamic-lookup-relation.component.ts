import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  DynamicFormControlComponent,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { isNotEmpty } from '../../../../../empty.util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DsDynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import { DynamicLookupRelationModel } from './dynamic-lookup-relation.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';
import { RelationshipService } from '../../../../../../core/data/relationship.service';

@Component({
  selector: 'ds-dynamic-lookup-relation',
  // styleUrls: ['./dynamic-lookup-relation.component.scss'],
  templateUrl: './dynamic-lookup-relation.component.html'
})
export class DsDynamicLookupRelationComponent extends DynamicFormControlComponent implements OnInit {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicLookupRelationModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  modalRef: NgbModalRef;
  modalValuesString = '';
  currentObjects;

  constructor(private modalService: NgbModal,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              private relationshipService: RelationshipService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
    this.currentObjects = this.relationshipService.getItemRelationshipLabels();
  }

  public hasEmptyValue() {
    return isNotEmpty(this.model.value);
  }

  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent);
    this.modalRef.componentInstance.relationKey = this.model.name;
    this.modalRef.result.then((resultList) => {
      this.model.value = resultList;
      this.modalValuesString = resultList.map((dso: DSpaceObject) => dso.name).join('; ');
    });
  }

  alert(t: string) {
    alert(t);
  }
}
