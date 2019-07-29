import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DsDynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import { DynamicLookupRelationModel } from './dynamic-lookup-relation.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';
import { RelationshipService } from '../../../../../../core/data/relationship.service';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../../../object-list/selectable-list/selectable-list.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchResult } from '../../../../../search/search-result.model';

/* TODO take a look at this when the REST entities submission is finished: we will probably need to get the fixed filter from the REST instead of filtering is out from the metadata field */
const RELATION_TYPE_METADATA_PREFIX = 'relation.isPublicationOf';

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
  listId: string;
  filter: string;
  searchConfig: string;


  constructor(private modalService: NgbModal,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              private relationService: RelationshipService,
              private selectableListService: SelectableListService
  ) {
    super(layoutService, validationService);
  }

  ngOnInit(): void {
    this.filter = this.model.relationship.filter;
    this.searchConfig = this.model.relationship.searchConfiguration;
    this.listId = 'list-' + this.model.relationship.relationshipType;
    this.model.value = this.selectableListService.getSelectableList(this.listId).pipe(
      map((listState: SelectableListState) => hasValue(listState) && hasValue(listState.selection) ? listState.selection : []),
    );
  }

  public hasResultsSelected(): Observable<boolean> {
    return this.model.value.pipe(map((list: SearchResult<DSpaceObject>[]) => isNotEmpty(list)));
  }

  openLookup() {
    this.modalRef = this.modalService.open(DsDynamicLookupRelationModalComponent, { size: 'lg' });
    const modalComp = this.modalRef.componentInstance;
    modalComp.repeatable = this.model.repeatable;
    modalComp.relationKey = this.model.name;
    modalComp.listId = this.listId;
    modalComp.filter = this.filter;
    modalComp.fieldName = this.searchConfig;
    modalComp.label = this.model.label;

    this.modalRef.result.then((resultString = '') => {
      this.modalValuesString = resultString;
    });
  }

  removeSelection(object: SearchResult<DSpaceObject>) {
    this.selectableListService.deselectSingle(this.listId, object);
  }
}
