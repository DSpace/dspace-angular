import { Component, Input } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { Observable } from 'rxjs';
import { RelationshipOptions } from '../../../models/relationship-options.model';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { map, take } from 'rxjs/operators';
import { createSuccessfulRemoteDataObject } from '../../../../../testing/utils';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { PaginatedList } from '../../../../../../core/data/paginated-list';

@Component({
  selector: 'ds-dynamic-lookup-relation-selection-tab',
  styleUrls: ['./dynamic-lookup-relation-selection-tab.component.scss'],
  templateUrl: './dynamic-lookup-relation-selection-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class DsDynamicLookupRelationSelectionTabComponent {
  @Input() label: string;
  @Input() relationship: RelationshipOptions;
  @Input() listId: string;
  @Input() itemRD$;
  @Input() repeatable: boolean;
  @Input() selection$: Observable<ListableObject[]>;
  @Input() selectionRD$: Observable<RemoteData<PaginatedList<ListableObject>>>;
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'submission-relation-list',
    pageSize: 5
  });

  constructor() {
  }

  ngOnInit() {
    this.selectionRD$ = this.selection$.pipe(
      take(1),
      map((selection) => createSuccessfulRemoteDataObject(new PaginatedList({} as any, selection)))
    );
  }
}