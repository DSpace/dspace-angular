import { Component, OnInit } from '@angular/core';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { Item } from '../../../../../core/shared/item.model';
import { Context } from '../../../../../core/shared/context.model';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { take } from 'rxjs/operators';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { DsDynamicLookupRelationModalComponent } from '../../../../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/dynamic-lookup-relation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NameVariantModalComponent } from './name-variant-modal/name-variant-modal.component';
import { Community } from '../../../../../core/shared/community.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { ItemDataService } from '../../../../../core/data/item-data.service';

const NOTIFICATION_CONTENT_KEY = 'submission.sections.describe.relationship-lookup.name-variant.notification.content';
const NOTIFICATION_CONFIRM_KEY = 'submission.sections.describe.relationship-lookup.name-variant.notification.confirm';
const NOTIFICATION_DECLINE_KEY = 'submission.sections.describe.relationship-lookup.name-variant.notification.decline';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.Workspace)
@Component({
  selector: 'ds-person-search-result-list-submission-element',
  styleUrls: ['./person-search-result-list-submission-element.component.scss'],
  templateUrl: './person-search-result-list-submission-element.component.html'
})

/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListSubmissionElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {
  suggestions: string[];
  allSuggestions: string[];
  selected: string;
  alternativeField = 'dc.title.alternative';

  constructor(protected truncatableService: TruncatableService,
              private relationshipService: RelationshipService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private modalService: NgbModal,
              private itemDataService: ItemDataService) {
    super(truncatableService);
  }

  ngOnInit() {
    super.ngOnInit();
    const defaultValue = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    const alternatives = this.allMetadataValues(this.alternativeField);
    this.allSuggestions = [defaultValue, ...alternatives];
    this.suggestions = this.allSuggestions;

    this.relationshipService.getNameVariant(this.listID, this.dso.uuid)
      .pipe(take(1))
      .subscribe((nameVariant: string) => {
          this.selected = nameVariant || defaultValue;
        }
      );
  }

  filter(query) {
    this.suggestions = this.allSuggestions.filter((suggestion) => suggestion.includes(query));
  }

  select(value) {
    this.relationshipService.setNameVariant(this.listID, this.dso.uuid, value);
  }

  selectCustom(value) {
    if (!this.allSuggestions.includes(value)) {
      this.openModal(value)
        .then(() => {

          const newName: MetadataValue = new MetadataValue();
          newName.value = value;

          const existingNames: MetadataValue[] = this.dso.metadata[this.alternativeField] || [];
          const alternativeNames = { [this.alternativeField]: [...existingNames, newName] };
          const updatedItem =
            Object.assign({}, this.dso, {
              metadata: {
                ...this.dso.metadata,
                ...alternativeNames
              },
            });
          this.itemDataService.update(updatedItem).pipe(take(1)).subscribe();
        })
    }
    this.select(value);
  }

  openModal(value): Promise<any> {
    const modalRef = this.modalService.open(NameVariantModalComponent, { size: 'lg' });
    const modalComp = modalRef.componentInstance;
    modalComp.value = value;
    return modalRef.result;
  }
}
