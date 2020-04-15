import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NameVariantModalComponent } from '../../name-variant-modal/name-variant-modal.component';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { SelectableListService } from '../../../../../shared/object-list/selectable-list/selectable-list.service';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.EntitySearchModalWithNameVariants)
@Component({
  selector: 'ds-person-search-result-list-submission-element',
  styleUrls: ['./person-search-result-list-submission-element.component.scss'],
  templateUrl: './person-search-result-list-submission-element.component.html'
})

/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListSubmissionElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {
  allSuggestions: string[];
  selectedName: string;
  alternativeField = 'dc.title.alternative';

  constructor(protected truncatableService: TruncatableService,
              private relationshipService: RelationshipService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private modalService: NgbModal,
              private itemDataService: ItemDataService,
              private bitstreamDataService: BitstreamDataService,
              private selectableListService: SelectableListService) {
    super(truncatableService);
  }

  ngOnInit() {
    super.ngOnInit();
    const defaultValue = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    const alternatives = this.allMetadataValues(this.alternativeField);
    this.allSuggestions = [defaultValue, ...alternatives];

    this.relationshipService.getNameVariant(this.listID, this.dso.uuid)
      .pipe(take(1))
      .subscribe((nameVariant: string) => {
        this.selectedName = nameVariant || defaultValue;
        }
      );
  }

  select(value) {
    this.selectableListService.isObjectSelected(this.listID, this.object)
      .pipe(take(1))
      .subscribe((selected) => {
        if (!selected) {
          this.selectableListService.selectSingle(this.listID, this.object);
        }
      });
    this.relationshipService.setNameVariant(this.listID, this.dso.uuid, value);
  }

  selectCustom(value) {
    if (!this.allSuggestions.includes(value)) {
      this.openModal(value)
        .then(() => {
          // user clicked ok: store the name variant in the item
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
            this.itemDataService.commitUpdates();
      }).catch(() => {
        // user clicked cancel: use the name variant only for this relation, no further action required
      }).finally(() => {
        this.select(value);
      })
    }
  }

  openModal(value): Promise<any> {
    const modalRef = this.modalService.open(NameVariantModalComponent, { centered: true });

    const modalComp = modalRef.componentInstance;
    modalComp.value = value;
    return modalRef.result;
  }

  // TODO refactor to return RemoteData, and thumbnail template to deal with loading
  getThumbnail(): Observable<Bitstream> {
    return this.bitstreamDataService.getThumbnailFor(this.dso).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }
}
