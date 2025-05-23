import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../config/app-config.interface';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { RelationshipDataService } from '../../../../../core/data/relationship-data.service';
import { Context } from '../../../../../core/shared/context.model';
import { Item } from '../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { SelectableListService } from '../../../../../shared/object-list/selectable-list/selectable-list.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { ThemedThumbnailComponent } from '../../../../../thumbnail/themed-thumbnail.component';
import { NameVariantModalComponent } from '../../name-variant-modal/name-variant-modal.component';
import { PersonInputSuggestionsComponent } from './person-suggestions/person-input-suggestions.component';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement, Context.EntitySearchModalWithNameVariants)
@Component({
  selector: 'ds-person-search-result-list-submission-element',
  styleUrls: ['./person-search-result-list-submission-element.component.scss'],
  templateUrl: './person-search-result-list-submission-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgClass,
    PersonInputSuggestionsComponent,
    ThemedThumbnailComponent,
  ],
})

/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListSubmissionElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {
  allSuggestions: string[];
  selectedName: string;
  alternativeField = 'dc.title.alternative';

  /**
   * Display thumbnail if required by configuration
   */
  showThumbnails: boolean;

  constructor(protected truncatableService: TruncatableService,
              private relationshipService: RelationshipDataService,
              private modalService: NgbModal,
              private itemDataService: ItemDataService,
              private selectableListService: SelectableListService,
              public dsoNameService: DSONameService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  ngOnInit() {
    super.ngOnInit();
    const defaultValue = this.dso ? this.dsoNameService.getName(this.dso) : undefined;
    const alternatives = this.allMetadataValues(this.alternativeField);
    this.allSuggestions = [defaultValue, ...alternatives];

    this.relationshipService.getNameVariant(this.listID, this.dso.uuid)
      .pipe(take(1))
      .subscribe((nameVariant: string) => {
        this.selectedName = nameVariant || defaultValue;
      },
      );
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
  }

  select(value) {
    this.relationshipService.setNameVariant(this.listID, this.dso.uuid, value);
    this.selectableListService.isObjectSelected(this.listID, this.object)
      .pipe(take(1))
      .subscribe((selected) => {
        if (!selected) {
          this.selectableListService.selectSingle(this.listID, this.object);
        }
      });
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
                  ...alternativeNames,
                },
              });
          this.itemDataService.update(updatedItem).pipe(take(1)).subscribe();
          this.itemDataService.commitUpdates();
        }).catch(() => {
        // user clicked cancel: use the name variant only for this relation, no further action required
        }).finally(() => {
          this.select(value);
        });
    }
  }

  openModal(value): Promise<any> {
    const modalRef = this.modalService.open(NameVariantModalComponent, { centered: true });

    const modalComp = modalRef.componentInstance;
    modalComp.value = value;
    return modalRef.result;
  }
}
