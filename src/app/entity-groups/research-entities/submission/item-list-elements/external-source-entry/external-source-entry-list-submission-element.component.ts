import { AbstractListableElementComponent } from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ExternalSourceEntry } from '../../../../../core/shared/external-source-entry.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { Context } from '../../../../../core/shared/context.model';
import { Component, Inject, OnInit } from '@angular/core';
import { Metadata } from '../../../../../core/shared/metadata.utils';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceEntryImportModalComponent } from '../../../../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component';
import { DsDynamicLookupRelationExternalSourceTabComponent } from '../../../../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component';
import { hasValue } from '../../../../../shared/empty.util';

@listableObjectComponent(ExternalSourceEntry, ViewMode.ListElement, Context.SubmissionModal)
@Component({
  selector: 'ds-external-source-entry-list-submission-element',
  styleUrls: ['./external-source-entry-list-submission-element.component.scss'],
  templateUrl: './external-source-entry-list-submission-element.component.html'
})
export class ExternalSourceEntryListSubmissionElementComponent extends AbstractListableElementComponent<ExternalSourceEntry> implements OnInit {
  /**
   * The metadata value for the object's uri
   */
  uri: MetadataValue;

  /**
   * The modal for importing the entry
   */
  modalRef: NgbModalRef;

  constructor(@Inject(DsDynamicLookupRelationExternalSourceTabComponent) private externalSourceTab: DsDynamicLookupRelationExternalSourceTabComponent,
              private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.uri = Metadata.first(this.object.metadata, 'dc.identifier.uri');
  }

  import(): void {
    this.modalRef = this.modalService.open(ExternalSourceEntryImportModalComponent, {
      size: 'lg',
      container: 'ds-dynamic-lookup-relation-modal'
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = this.object;
    if (hasValue(this.externalSourceTab) && hasValue(this.externalSourceTab.relationship)) {
      modalComp.relationship = this.externalSourceTab.relationship;
    }
  }
}
