import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemComponent } from '../shared/item.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { getRelatedItemsByTypeLabel } from '../shared/item-relationships-utils';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent implements OnInit {
  /**
   * The authors related to this publication
   */
  authors$: Observable<MetadataRepresentation[]>;

  /**
   * The projects related to this publication
   */
  projects$: Observable<Item[]>;

  /**
   * The organisation units related to this publication
   */
  orgUnits$: Observable<Item[]>;

  /**
   * The journal issues related to this publication
   */
  journalIssues$: Observable<Item[]>;

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    super.ngOnInit();

    if (this.resolvedRelsAndTypes$) {

      this.authors$ = this.buildRepresentations('Person', 'dc.contributor.author');

      this.projects$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.object.id, 'isProjectOfPublication')
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.object.id, 'isOrgUnitOfPublication')
      );

      this.journalIssues$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.object.id, 'isJournalIssueOfPublication')
      );

    }
  }
}
