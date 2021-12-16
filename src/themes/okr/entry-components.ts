import { PublicationComponent } from './app/item-page/simple/item-types/publication/publication.component';
import { ItemSearchResultListElementComponent } from './app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { PersonSearchResultListElementComponent } from './app/entity-groups/research-entities/item-list-elements/search-result-list-elements/person/person-search-result-list-element.component';
import { JournalSearchResultListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/search-result-list-elements/journal/journal-search-result-list-element.component';
import { JournalIssueSearchResultListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/search-result-list-elements/journal-issue/journal-issue-search-result-list-element.component';
import { JournalVolumeSearchResultListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/search-result-list-elements/journal-volume/journal-volume-search-result-list-element.component';
import { CitationsSectionComponent } from './app/item-page/field-components/citation/citations-section.component';
import { CcIconsComponent } from './app/item-page/field-components/cc-icons/cc-icons.component';
import { AltmetricDonutComponent } from './app/item-page/field-components/citation/altmetric-donut/altmetric-donut.component';
import { ItemPageWbDateFieldComponent } from './app/item-page/field-components/specific-field/wb-date/item-page-wb-date-field.component';
import { ItemPageWbGenericWithFallbackComponent } from './app/item-page/field-components/specific-field/wb-generic-with-fallback/item-page-wb-generic-with-fallback.component';
import { ItemPageWbExternalContentComponent } from './app/item-page/field-components/specific-field/wb-external-content/item-page-wb-external-content.component';
import { UntypedItemComponent } from './app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { JournalComponent } from './app/entity-groups/journal-entities/item-pages/journal/journal.component';
import { JournalIssueComponent } from './app/entity-groups/journal-entities/item-pages/journal-issue/journal-issue.component';
import { JournalVolumeComponent } from './app/entity-groups/journal-entities/item-pages/journal-volume/journal-volume.component';
import { JournalVolumeGridElementComponent } from './app/entity-groups/journal-entities/item-grid-elements/journal-volume/journal-volume-grid-element.component';
import { JournalVolumeSearchResultGridElementComponent } from './app/entity-groups/journal-entities/item-grid-elements/search-result-grid-elements/journal-volume/journal-volume-search-result-grid-element.component';
import { JournalIssueSearchResultGridElementComponent } from './app/entity-groups/journal-entities/item-grid-elements/search-result-grid-elements/journal-issue/journal-issue-search-result-grid-element.component';
import { JournalIssueGridElementComponent } from './app/entity-groups/journal-entities/item-grid-elements/journal-issue/journal-issue-grid-element.component';
import { JournalVolumeSidebarSearchListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/sidebar-search-list-elements/journal-volume/journal-volume-sidebar-search-list-element.component';
import { JournalIssueSidebarSearchListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/sidebar-search-list-elements/journal-issue/journal-issue-sidebar-search-list-element.component';
import { JournalIssueListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/journal-issue/journal-issue-list-element.component';
import { JournalVolumeListElementComponent } from './app/entity-groups/journal-entities/item-list-elements/journal-volume/journal-volume-list-element.component';
import { FeaturedPublicationsListElementComponent } from './app/featured-publications/featured-publications-list-element/featured-publications-list-element.component';
import { ClaimedTaskActionsMarkDuplicateComponent } from './app/shared/mydspace-actions/claimed-task/mark-duplicate/claimed-task-actions-mark-duplicate.component';
import { ClaimedTaskActionsReportProblemComponent } from './app/shared/mydspace-actions/claimed-task/report-problem/claimed-task-actions-report-problem.component';
import { SingleStatletTableComponent } from './app/atmire-cua/statlets/shared/single-statlet/graph-types/single-statlet-table/single-statlet-table.component';
import { OkrSearchHierarchyFilterComponent } from './app/shared/search/search-filters/search-filter/okr-search-hierarchy-filter/okr-search-hierarchy-filter.component';
import { OkrVocabularyTreeviewComponent } from './app/shared/okr-vocabulary-treeview/okr-vocabulary-treeview.component';

export const ENTRY_COMPONENTS = [
  PublicationComponent,
  ItemSearchResultListElementComponent,
  PersonSearchResultListElementComponent,
  JournalSearchResultListElementComponent,
  JournalVolumeSearchResultListElementComponent,
  JournalIssueSearchResultListElementComponent,
  UntypedItemComponent,
  AltmetricDonutComponent,
  CitationsSectionComponent,
  CcIconsComponent,
  ItemPageWbDateFieldComponent,
  ItemPageWbGenericWithFallbackComponent,
  ItemPageWbExternalContentComponent,
  JournalComponent,
  JournalIssueComponent,
  JournalVolumeComponent,
  JournalVolumeGridElementComponent,
  JournalVolumeSearchResultGridElementComponent,
  JournalIssueSearchResultGridElementComponent,
  JournalIssueGridElementComponent,
  JournalVolumeSidebarSearchListElementComponent,
  JournalIssueSidebarSearchListElementComponent,
  JournalIssueListElementComponent,
  JournalVolumeListElementComponent,
  FeaturedPublicationsListElementComponent,
  ClaimedTaskActionsMarkDuplicateComponent,
  ClaimedTaskActionsReportProblemComponent,
  SingleStatletTableComponent,
  OkrSearchHierarchyFilterComponent,
  OkrVocabularyTreeviewComponent,
];
