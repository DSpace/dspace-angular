import { Component } from '@angular/core';
import { rendersEntityType } from '../../../../entities/entity-type-decorator';
import { ElementViewMode } from '../../../../view-mode';
import { EntitySearchResultComponent } from '../entity-search-result-component';

@rendersEntityType('JournalIssue', ElementViewMode.SetElement)
@Component({
  selector: 'ds-journal-issue-list-element',
  styleUrls: ['./journal-issue-list-element.component.scss'],
  templateUrl: './journal-issue-list-element.component.html'
})
/**
 * The component for displaying a list element for an item with entity type Journal Issue
 */
export class JournalIssueListElementComponent extends EntitySearchResultComponent {
}
