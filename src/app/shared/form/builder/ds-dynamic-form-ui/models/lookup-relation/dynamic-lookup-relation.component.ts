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
import { Item } from '../../../../../../core/shared/item.model';

@Component({
  selector: 'ds-dynamic-lookup-relation',
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
  selectedResults: Item[];

  constructor(private modalService: NgbModal,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              private relationService: RelationshipService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
  }

  public hasResultsSelected() {
    return isNotEmpty(this.selectedResults);
  }

  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent, { size: 'lg' });
    this.modalRef.componentInstance.repeatable = this.model.repeatable;
    this.modalRef.componentInstance.selection = this.selectedResults || [];
    this.modalRef.componentInstance.previousSelection = this.model.value || [];
    this.modalRef.componentInstance.relationKey = this.model.name;
    this.modalRef.result.then((resultList) => {
      this.selectedResults = resultList;
      this.modalValuesString = resultList.map((dso: DSpaceObject) => dso.name).join('; ');
    });
  }

  add() {
    if (isNotEmpty(this.model.value)) {
      this.model.value = [...this.model.value, ...this.selectedResults];
    } else {
      this.model.value = this.selectedResults;
    }

    this.modalValuesString = '';
    this.selectedResults = [];
    this.selectedResults.forEach((item: Item) => {
      this.relationService.addRelationship(this.model.item, item);
    })
  }

  removeSelection(uuid: string) {
    this.model.value = this.model.value.filter((dso: DSpaceObject) => dso.uuid !== uuid);
  }
}
